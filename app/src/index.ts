import { PrismaClient } from "@prisma/client";
import hypixel from "hypixel-api-reborn";
import Discord from "discord.js";
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

import { createAPIServer } from "server";

dotenv.config();

export const client = new Discord.Client({
    intents: ["Guilds", "GuildMembers", "GuildMessages", "GuildMessageReactions"],
});

export const talkedRecently = new Set();

export const prisma = new PrismaClient();

export const hypixelClient = new hypixel.Client(process.env.API_KEY);

export const clientInteractions = new Discord.Collection<string, Command>();

(async () => {
    await binder();
    await client.login(process.env.TOKEN);
    await createAPIServer(client, prisma);
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
    cron.scheduleJob("0 0 * * *", async function () {
        const todayDate = new Date();
        const todayDateString = `${todayDate.getMonth()}/${todayDate.getDate()}`;

        const findBirthdaysToday = await prisma.birthdays.findMany({
            where: { birthday: todayDateString },
        });

        for (const birthday of findBirthdaysToday) {
            const guildID = birthday.idOfGuild;
            const birthdayTimestamp = birthday.birthdayTimestamp;

            const user = await client.users.fetch(birthday.idOfUser);

            const findRelatedChannels = await prisma.birthdaysChannels.findMany({
                where: { idOfGuild: guildID },
            });

            for (const channel of findRelatedChannels) {
                const fetchChannel = (await client.channels.fetch(channel.idOfChannel)) as Discord.TextChannel;

                await fetchChannel.send(`:partying_face: Happy birthday ${user}! According to my database, you were born ${timestampYear(birthdayTimestamp)}.`);
            }
        }
    });
}
