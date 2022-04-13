import { Sequelize } from "sequelize";
import Discord from "discord.js";
import path from "path";
import glob from "fast-glob";
import hypixel from "hypixel-api-reborn";
import cron from "node-schedule";
import chalk from "chalk";

import { log } from "./utils/Logger";
import { logError } from "./utils/SendLog";
import { timestampYear } from "./utils/Timestamp";

import { Command } from "./interfaces/Command";
import { Event } from "./interfaces/Event";

import { defineDbModels } from "./models/models";

import { createAPIServer } from "../api/server";

import { Token } from "./token";

export const client = new Discord.Client({
	intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

export const talkedRecently = new Set();

export const db = new Sequelize("database", "username", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: process.cwd() + "/database/db.sqlite",
});

export const hypixelClient = new hypixel.Client(process.env.API_KEY);

export const clientInteractions = new Discord.Collection<string, Command>();

(async () => {
	await defineDbModels();
	await binder();
	await client.login(Token);
	await createAPIServer(client, db);
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
		const errorEmbed = new Discord.MessageEmbed()
			.setDescription("<:no:835565213322575963> An error has been detected... \n" + `\`\`\`${error.stack}\`\`\``)
			.setTimestamp()
			.setFooter(client.user.username, client.user.displayAvatarURL())
			.setColor("DARK_RED");

		logError(client, errorEmbed);
	});
}

async function runCronJobs() {
	cron.scheduleJob("0 0 * * *", async function () {
		const todayDate = new Date();
		const todayDateString = `${todayDate.getMonth()}/${todayDate.getDate()}`;

		const findBirthdaysToday = await db.model("birthdays").findAll({ where: { birthday: todayDateString } });

		for (let i = 0; i < findBirthdaysToday.length; i++) {
			const guildID: string = findBirthdaysToday[i]["idOfGuild"];
			const birthdayTimestamp: number = findBirthdaysToday[i]["birthdayTimestamp"];
			const user = await client.users.fetch(findBirthdaysToday[i]["idOfUser"]);
			const findRelatedChannels = await db.model("birthdaysChannels").findAll({ where: { idOfGuild: guildID } });

			for (let y = 0; y < findRelatedChannels.length; y++) {
				const fetchChannel = (await client.channels.fetch(findRelatedChannels[y]["idOfChannel"])) as Discord.TextChannel;

				await fetchChannel.send(`:partying_face: Happy birthday ${user}! According to my database, you were born ${timestampYear(birthdayTimestamp)}.`);
			}
		}
	});
}
