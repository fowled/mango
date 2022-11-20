import { Client, TextChannel, Collection, EmbedBuilder } from "discord.js";
import { Client as Hypixel } from "hypixel-api-reborn";
import { createClient } from "@supabase/supabase-js";
import { scheduleJob } from "node-schedule";
import { yellow, redBright } from "chalk";
import { sync } from "fast-glob";
import { config } from "dotenv";
import { resolve } from "path";
import express from "express";
import cors from "cors";

import { getUsersCount } from "utils/usersCount";
import { timestampYear } from "utils/timestamp";
import { logError } from "utils/sendLog";
import { log } from "utils/logger";

import { Command } from "interfaces/Command";
import { Event } from "interfaces/Event";

import { Database } from "interfaces/DB";

config();

export const client = new Client({
    intents: ["Guilds", "GuildMembers", "GuildMessages", "GuildMessageReactions"],
});

export const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

export const hypixelClient = new Hypixel(process.env.API_KEY);

export const clientInteractions = new Collection<string, Command>();

(async () => {
    await Promise.all([
        await binder(),
        await client.login(process.env.TOKEN),
        await httpServer(),
        await handleRejections(),
        await runCronJobs()
    ])
})();

async function binder() {
    const eventFiles = sync("src/events/*.ts");
    const commandFiles = sync("src/commands/**/*.ts");

    eventFiles.map(async (file) => {
        const event: Event = await import(resolve(file));

        if (event.once) {
            client.once(event.name, async (...args) => await event.execute(client, ...args));
        } else {
            client.on(event.name, async (...args) => await event.execute(client, ...args));
        }
    });

    commandFiles.map(async (file) => {
        const command: Command = await import(resolve(file));

        clientInteractions.set(command.name, command);
    });

    log(`${yellow("loaded")} all ${redBright("commands")} & ${redBright("events")}`);
}

async function handleRejections() {
    process.on("unhandledRejection", (error: Error) => {
        const errorEmbed = new EmbedBuilder()
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
    scheduleJob("0 0 * * *", async function () {
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

async function httpServer() {
    const app = express();

    app.use(cors({ origin: process.env.CLIENT_URL }));

    app.get("/stats", async (_req, res) => {
        return res.send({ guilds: client.guilds.cache.size, users: await getUsersCount(client) });
    });

    app.get("/guild/:guildId", async (req, res) => {
        return res.send(await client.guilds.fetch(req.params.guildId));
    });

    app.listen(process.env.PORT, () => {
        log(`${yellow("listening")} to ${redBright("requests")}`);
    });
}
