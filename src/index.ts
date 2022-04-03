import { Sequelize } from "sequelize";
import Discord from "discord.js";
import fs from "fs";
import path from "path";
import hypixel from "hypixel-api-reborn";
import cron from "node-schedule";
import chalk from "chalk";

import { log } from "./utils/Logger";
import { logError } from "./utils/SendLog";
import { timestampYear } from "./utils/Timestamp";

import { createAPIServer } from "../api/server";

import { Token } from "./token";

export const client: Discord.Client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

export const talkedRecently = new Set();

export const sequelizeinit = new Sequelize("database", "username", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: `${process.cwd()}/database/db.sqlite`,
});

export const ops = {
	sequelize: sequelizeinit,
};

export const hypixelClient: hypixel.Client = new hypixel.Client(process.env.API_KEY);

(async () => {
	await eventBinder();
	await handleRejections();
	await client.login(Token);
	await registerCommands();
	await createAPIServer(client, sequelizeinit);
	await runCronJobs();
})();

async function eventBinder() {
	const eventFiles = fs.readdirSync(__dirname + "/events/").filter((file) => file.endsWith(".ts"));

	for (const file of eventFiles) {
		const event = require(`./events/${file}`);

		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}

	log(`📦 Successfully loaded ${chalk.yellow(eventFiles.length)} events!`);
}

async function handleRejections() {
	process.on("unhandledRejection", (error: Error) => {
		const errorEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setDescription("<:no:835565213322575963> An error has been detected... \n" + `\`\`\`${error.stack}\`\`\``)
			.setTimestamp()
			.setFooter(client.user.username, client.user.displayAvatarURL())
			.setColor("DARK_RED");

		logError(client, errorEmbed);
	});
}

const clientInteractions: any = new Discord.Collection();

async function registerCommands() {
	const commandFolders = fs.readdirSync(path.join(__dirname, "commands"));

	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(path.join(__dirname, "commands", folder)).filter((file) => file.endsWith(".ts"));

		for (const file of commandFiles) {
			const command = require(`./commands/${folder}/${file}`);

			clientInteractions.set(command.name, command);
		}
	}
}

async function runCronJobs() {
	cron.scheduleJob("0 0 * * *", async function () {
		const todayDate = new Date();
		const todayDateString = `${todayDate.getMonth()}/${todayDate.getDate()}`;

		const findBirthdaysToday = await sequelizeinit.model("birthdays").findAll({ where: { birthday: todayDateString } });

		for (let i = 0; i < findBirthdaysToday.length; i++) {
			const guildID = findBirthdaysToday[i]["idOfGuild"];
			const user = await client.users.fetch(findBirthdaysToday[i]["idOfUser"]);
			const birthdayTimestamp = findBirthdaysToday[i]["birthdayTimestamp"];
			const findRelatedChannels = await sequelizeinit.model("birthdaysChannels").findAll({ where: { idOfGuild: guildID } });

			for (let y = 0; y < findRelatedChannels.length; y++) {
				const fetchChannel: Discord.TextChannel = (await client.channels.fetch(findRelatedChannels[y]["idOfChannel"])) as unknown as Discord.TextChannel;

				await fetchChannel.send(`:partying_face: Happy birthday ${user}! According to my database, you were born ${timestampYear(birthdayTimestamp)}.`);
			}
		}
	});
}

export { clientInteractions };
