import * as Discord from "discord.js";
import { clientInteractions } from "../index";

import { ops } from "../index";
import * as Logger from "../utils/Logger";

import { logCommand } from "../utils/SendLog";

module.exports = {
	name: "interactionCreate",
	async execute(interaction: Discord.CommandInteraction, Client: Discord.Client) {
		if (interaction.isButton()) return;

		const args: string[] = interaction.options.data.map(opt => opt.value.toString());
		const command: string = interaction.commandName;

		if (!interaction.isCommand() && !clientInteractions.has(command)) return;

		const commandInteraction: any = clientInteractions.get(command);
		const interactionMember: Discord.GuildMember = interaction.member as unknown as Discord.GuildMember;
		
		if (commandInteraction.memberPermissions && !interactionMember.permissions.has(commandInteraction.memberPermissions)) {
			return interaction.reply({ content: `<:no:835565213322575963> Sorry, but it looks like you're missing one of the following permissions: \`${commandInteraction.memberPermissions.join(", ")}\``, ephemeral: true });
		} else if (commandInteraction.botPermissions && !interaction.guild.me.permissions.has(commandInteraction.botPermissions)) {
			return interaction.reply({ content: `<:no:835565213322575963> It looks like I'm missing one of the following permissions: \`${commandInteraction.botPermissions.join(", ")}\``, ephemeral: true });
		}
		
		await interaction.deferReply();
		
		try {
			commandInteraction.execute(Client, interaction, args, ops);
		} catch (err) {
			Logger.error(err);
		}

		logCommand(Client, `\`\`\`diff\n+ ${interaction.user.tag} just used the ${interaction.commandName} interaction in ${interaction.guild.name}.\`\`\``);
	}
};
