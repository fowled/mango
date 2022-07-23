import Discord from "discord.js";

import { error } from "../../utils/Logger";
import { insertLog } from "../../utils/LogChecker";

// Mod command

/**
 * Locks a channel
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "lockchannel",
	description: "Locks a channel",
	category: "moderation",
	botPermissions: ["MANAGE_CHANNELS"],
	memberPermissions: ["MANAGE_CHANNELS"],
	options: [
		{
			name: "role",
			type: "MENTIONABLE",
			description: "The role you want to lock the channel to",
			required: true,
		},

		{
			name: "channel",
			type: "CHANNEL",
			description: "The channel that will be locked",
			required: false,
		},
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
		const role = await interaction.guild.roles.fetch(args[0]);
		const messageChannel = !args[1] ? (interaction.channel as Discord.GuildChannel) : await interaction.guild.channels.fetch(args[1]);

		if (!role) {
			return interaction.editReply("I didn't find the role you specified. <:no:835565213322575963>");
		}

		messageChannel.permissionOverwrites
			.create(role, {
				SEND_MESSAGES: false,
			})
			.then(() => {
				interaction.editReply(`<:yes:835565213498736650> ${messageChannel} has been locked for ${role}.`);
			})
			.catch((err) => {
				error(err);

				interaction.editReply("An error occured. <:no:835565213322575963> ```\n" + err + "```");
			});

		insertLog(Client, interaction.guild.id, interaction.member.user, `**${interaction.channel}** (\`${(interaction.channel as Discord.TextChannel).name}\`) has been locked by *${interaction.member.user.tag}*`);
	},
};
