import Discord from "discord.js";
import glob from "fast-glob";
import path from "path";

import { Command } from "../interfaces/Command";

import { log } from "./logger";

export async function create(client: Discord.Client) {
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

		await client.application.commands.create(commandObject);

		log(`${command.name} has been created`);
	});
}

export async function remove(client: Discord.Client) {
	await client.application.commands.fetch().then((cmd) =>
		cmd.forEach(async (cmd) => {
			await cmd.delete();

			log(`${cmd.name} has been deleted`);
		}),
	);
}
