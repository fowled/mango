import { createClient } from "@supabase/supabase-js";
import Discord, { TextChannel } from "discord.js";
import hypixel from "hypixel-api-reborn";
import cron from "node-schedule";
import glob from "fast-glob";
import dotenv from "dotenv";
import chalk from "chalk";
import path from "path";

import { timestampYear } from "utils/timestamp";
import { log, error } from "utils/logger";

import { Command } from "interfaces/Command";
import { Event } from "interfaces/Event";

import { Database } from "interfaces/DB";

dotenv.config();

export const client = new Discord.Client({
    intents: ["Guilds", "GuildMembers", "GuildMessages", "GuildMessageReactions"],
});

export const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

export const hypixelClient = new hypixel.Client(process.env.API_KEY);

export const clientInteractions = new Discord.Collection<string, Command>();

export const cachedIds = [];

(async () => {
    binder();
    await client.login(process.env.TOKEN);
    handleRejections();
    runCronJobs();
})();

function binder() {
    const eventFiles = glob.sync("src/events/*.ts");
    const commandFiles = glob.sync("src/commands/**/*.ts");

    Promise.all(eventFiles.map(async (file) => {
        const event: Event = await import(path.resolve(file));

        if (event.once) {
            client.once(event.name, async (...args) => await event.execute(client, ...args));
        } else {
            client.on(event.name, async (...args) => await event.execute(client, ...args));
        }
    }));

    Promise.all(commandFiles.map(async (file) => {
        const command: Command = await import(path.resolve(file));

        clientInteractions.set(command.name, command);
    }));

    log(`${chalk.yellow("loaded")} all ${chalk.redBright("commands")} & ${chalk.redBright("events")}`);
}

function handleRejections() {
    process.on("unhandledRejection", (err: Error) => {
        error(err.stack);
    });
}

function runCronJobs() {
    cron.scheduleJob("0 0 * * *", async function () {
        const findBirthdaysToday = await supabase.rpc("get_today_birthdays");

        if (findBirthdaysToday.data.length === 0) return;

        Promise.all(findBirthdaysToday.data.map(async (data) => {
            if (!data.guilds) return;

            Promise.all(data.guilds.map(async (guildId) => {
                const fetchGuildFromDB = await supabase.from("guilds").select().like("guild_id", guildId).single();

                if (!fetchGuildFromDB.data?.birthdays) return;

                const fetchGuild = await client.guilds.fetch(guildId.toString());
                const fetchChannel = await fetchGuild.channels.fetch(fetchGuildFromDB.data.birthdays.toString()) as TextChannel;
                const fetchUser = await client.users.fetch(data.user_id);

                const getBirthday = new Date(data.birthday).getTime();

                await fetchChannel.send(`:partying_face: Happy birthday ${fetchUser}! According to my database, you were born ${timestampYear(getBirthday)}.`);
            }));
        }));
    });
}
