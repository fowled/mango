import { greenBright, red, magentaBright } from "chalk";
import Discord from "discord.js";
import glob from "fast-glob";
import path from "path";

import { Command } from "../interfaces/Command";

import { log } from "./logger";

export async function create(client: Discord.Client) {
	const guildID: string = process.env.GUILD_ID;
	const guild: Discord.Guild = await client.guilds.fetch(guildID);

	const commandFiles = glob.sync("src/commands/**/*.ts");

	commandFiles.map(async (file) => {
		const command: Command = await import(path.resolve(file));

		const commandObject = {
			name: command.name,
			description: command.description,
		};

		if (command.options) {
			Object.assign(commandObject, { options: command.options });
		}

		if (command.subcommands) {
			Object.assign(commandObject, { options: command.subcommands });
		}

		await guild.commands.create(commandObject);

		log(`${magentaBright(command.name)} has been ${greenBright("created")}`);
	});
}

export async function remove(client: Discord.Client) {
	const guildID: string = process.env.GUILD_ID;
	const guild: Discord.Guild = await client.guilds.fetch(guildID);

	await guild.commands.fetch().then((cmd) =>
		cmd.forEach(async (cmd) => {
			await cmd.delete();

			log(`${magentaBright(cmd.name)} has been ${red("deleted")}`);
		}),
	);
}
