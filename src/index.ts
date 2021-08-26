import * as Discord from "discord.js";
import * as Sequelize from "sequelize";
import * as fs from "fs";
import * as path from "path";

import * as Logger from "./utils/Logger";
import { Token } from "./token";

export const client: Discord.Client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

export const talkedRecently = new Set();
const queue = new Map();
export const sequelizeinit = new Sequelize.Sequelize("database", "username", "password", {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: `${process.cwd()}/database/db.sqlite`,
});

export const ops = {
	sequelize: sequelizeinit
};

(async () => {
	await eventBinder();
	await handleRejections();
	await client.login(Token);
	await registerCommands();
})();

async function eventBinder() {
	const eventFiles = fs.readdirSync(__dirname + '/events/').filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const event = require(`./events/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}

	Logger.log(`Successfully loaded ${eventFiles.length} events`);
}

async function handleRejections() {
	process.on("unhandledRejection", error => {
		console.warn("Unhandled promise rejection:", error);
	});
}

let clientInteractions: any = new Discord.Collection();

async function registerCommands() {
	const commandFolders = fs.readdirSync(path.join(__dirname, "commands"));

	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(path.join(__dirname, "commands", folder)).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`./commands/${folder}/${file}`);
			clientInteractions.set(command.name, command);
		}
	}
}

export { clientInteractions };
