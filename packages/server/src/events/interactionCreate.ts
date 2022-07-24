import Discord from "discord.js";

import { clientInteractions, prisma } from "../index";

import { logCommand } from "../utils/SendLog";
import { error } from "../utils/Logger";

module.exports = {
	name: "interactionCreate",
	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message) {
		if (interaction.isButton()) return;

		const args = interaction.options.data.filter((data) => data.type !== "SUB_COMMAND").map((opt) => opt.value.toString());
		const command = interaction.commandName;

		if (!interaction.isCommand() && !clientInteractions.has(command)) return;

		const commandInteraction = clientInteractions.get(command);
		const interactionMember = interaction.member;

		if (commandInteraction.memberPermissions && !interactionMember.permissions.has(commandInteraction.memberPermissions as Discord.PermissionResolvable)) {
			return interaction.reply({
				content: `<:no:835565213322575963> Sorry, but it looks like you're missing one of the following permissions: \`${commandInteraction.memberPermissions.join(", ")}\``,
				ephemeral: true,
			});
		} else if (commandInteraction.botPermissions && !interaction.guild.me.permissions.has(commandInteraction.botPermissions as Discord.PermissionResolvable)) {
			return interaction.reply({
				content: `<:no:835565213322575963> It looks like I'm missing one of the following permissions: \`${commandInteraction.botPermissions.join(", ")}\``,
				ephemeral: true,
			});
		}

		await interaction.deferReply();

		try {
			commandInteraction.execute(Client, interaction, args, prisma);
		} catch (err) {
			error(err);
		}

		const commandEmbed = new Discord.MessageEmbed()
			.setDescription(`**${interaction.user.tag}** just ran the \`${interaction.commandName}\` command in *${interaction.guild.name}*.`)
			.setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
			.setColor("NOT_QUITE_BLACK")
			.setTimestamp()
			.setFooter(Client.user.username, Client.user.displayAvatarURL());

		logCommand(Client, commandEmbed);
	},
};
