import * as Discord from "discord.js";
import * as Fs from "fs";

import { ops } from "../index";
import * as Logger from "../utils/Logger";

module.exports = {
	name: "interactionCreate",
	execute(interaction: Discord.CommandInteraction, Client: Discord.Client) {
		let args: string[] = interaction.options.map(opt => opt.value.toString());
		const command: string = interaction.commandName;

		if (!interaction.isCommand() && !Client.commands.has(command)) return;

		try {
			Client.commands.get(command).execute(Client, interaction, args, ops);
			Logger.log(`${interaction.user.tag} just used the ${interaction.commandName} interaction in ${interaction.guild.name}.`);
		} catch (err) {
			Logger.error(err);
			Logger.log(`The interaction ${interaction.user.tag} tried to call in ${interaction.guild.name} doesen't seem to exist (${interaction.commandName})`);
		}
	}
};
