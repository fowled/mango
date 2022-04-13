import Discord from "discord.js";
import glob from "fast-glob";
import path from "path";

import { Command } from "../interfaces/command";

export async function SlashCommands(client: Discord.Client) {
	await client.application.commands.fetch().then((cmd) =>
		cmd.forEach((cmd) => {
			cmd.delete();
		})
	);

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
	});
}
