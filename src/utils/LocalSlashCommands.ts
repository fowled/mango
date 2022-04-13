import Discord from "discord.js";
import glob from "fast-glob";
import path from "path";

import { Command } from "../interfaces/Command";

export async function SlashCommands(client: Discord.Client) {
	const guildID: string = process.env.GUILD_ID;
	const guild: Discord.Guild = await client.guilds.fetch(guildID);

	await guild.commands.fetch().then((cmd) =>
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

		await guild.commands.create(commandObject);
	});
}
