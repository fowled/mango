import * as Discord from "discord.js";
import { clientInteractions } from "../index";

import { ops } from "../index";
import * as Logger from "../utils/Logger";

module.exports = {
	name: "interactionCreate",
	execute(interaction: Discord.CommandInteraction, Client: Discord.Client) {
		let args: string[] = interaction.options.data.map(opt => opt.value.toString());
		const command: string = interaction.commandName;

		if (!interaction.isCommand() && !clientInteractions.has(command)) return;

		try {
			clientInteractions.get(command).execute(Client, interaction, args, ops);
		} catch (err) {
			Logger.error(err);
			Logger.log(`The interaction ${interaction.user.tag} tried to call in ${interaction.guild.name} doesen't seem to exist (${interaction.commandName})`);
		}

		Logger.log(`${interaction.user.tag} just used the ${interaction.commandName} interaction in ${interaction.guild.name}.`);
	}
};
