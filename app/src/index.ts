import { createClient } from "@supabase/supabase-js";
import Discord, { TextChannel } from "discord.js";
import hypixel from "hypixel-api-reborn";
import cron from "node-schedule";
import glob from "fast-glob";
import dotenv from "dotenv";
import chalk from "chalk";
import path from "path";

import { timestampYear } from "utils/timestamp";
import { logError } from "utils/sendLog";
import { log } from "utils/logger";

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

(async () => {
    await binder();
    await client.login(process.env.TOKEN);
    await handleRejections();
    await runCronJobs();
})();

async function binder() {
    const eventFiles = glob.sync("src/events/*.ts");
    const commandFiles = glob.sync("src/commands/**/*.ts");

    eventFiles.map(async (file) => {
        const event: Event = await import(path.resolve(file));

        if (event.once) {
            client.once(event.name, async (...args) => await event.execute(client, ...args));
        } else {
            client.on(event.name, async (...args) => await event.execute(client, ...args));
        }
    });

    commandFiles.map(async (file) => {
        const command: Command = await import(path.resolve(file));

        clientInteractions.set(command.name, command);
    });

    log(`${chalk.yellow("loaded")} all ${chalk.redBright("commands")} & ${chalk.redBright("events")}`);
}

async function handleRejections() {
    process.on("unhandledRejection", (error: Error) => {
        const errorEmbed = new Discord.EmbedBuilder()
            .setDescription("<:no:835565213322575963> An error has been detected... \n" + `\`\`\`${error.stack}\`\`\``)
            .setTimestamp()
            .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL(),
            })
            .setColor("DarkRed");

        logError(client, errorEmbed);
    });
}

async function runCronJobs() {
    cron.scheduleJob("51 13 * * *", async function() {
        const findBirthdaysToday = await supabase.rpc("get_today_birthdays");

        if (findBirthdaysToday.data.length === 0) return;

        for (const data of findBirthdaysToday.data) {
            if (!data.guilds) return;

            for (const guildId of data.guilds) {
                const fetchGuildFromDB = await supabase.from("guilds").select().like("guild_id", guildId).single();

                if (!fetchGuildFromDB.data?.birthdays) return;

                const fetchGuild = await client.guilds.fetch(BigInt(guildId).toString());
                const fetchChannel = await fetchGuild.channels.fetch(BigInt(fetchGuildFromDB.data.birthdays).toString()) as TextChannel;
                const fetchUser = await client.users.fetch(data.user_id);

                const getBirthday = new Date(data.birthday).getTime();

                await fetchChannel.send(`:partying_face: Happy birthday ${fetchUser}! According to my database, you were born ${timestampYear(getBirthday)}.`);
            }
        }
    });
}
