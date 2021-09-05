import * as Discord from "discord.js";
import { clientInteractions } from "../index";

import { ops } from "../index";
import * as Logger from "../utils/Logger";

module.exports = {
	name: "interactionCreate",
	execute(interaction: Discord.CommandInteraction, Client: Discord.Client) {
		if (interaction.isButton()) return;

		let args: string[] = interaction.options.data.map(opt => opt.value.toString());
		const command: string = interaction.commandName;

		if (!interaction.isCommand() && !clientInteractions.has(command)) return;

		const commandInteraction: any = clientInteractions.get(command);
		const interactionMember: Discord.GuildMember = interaction.member as unknown as Discord.GuildMember;

		if (commandInteraction.memberPermissions && !interactionMember.permissions.has(commandInteraction.memberPermissions)) {
			return interaction.reply({ content: `<:no:835565213322575963> Sorry, but it looks like you're missing one of the following permissions: \`${commandInteraction.memberPermissions.join(", ")}\``, ephemeral: true});
		} else if (commandInteraction.botPermissions && !interaction.guild.me.permissions.has(commandInteraction.botPermissions)) {
			return interaction.reply({ content: `<:no:835565213322575963> It looks like I'm missing one of the following permissions: \`${commandInteraction.botPermissions.join(", ")}\``, ephemeral: true});
		}

		try {
			commandInteraction.execute(Client, interaction, args, ops);
		} catch (err) {
			Logger.error(err);
			Logger.log(`The interaction ${interaction.user.tag} tried to call in ${interaction.guild.name} doesen't seem to exist (${interaction.commandName})`);
		}

		Logger.log(`${interaction.user.tag} just used the ${interaction.commandName} interaction in ${interaction.guild.name}.`);
	}
};
