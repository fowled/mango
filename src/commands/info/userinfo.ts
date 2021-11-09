import * as Discord from "discord.js";
import { timestamp } from "../../utils/Timestamp";

// Member command

/**
 * Shows some user information.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "userinfo",
	description: "Get useful information from a user",
	category: "info",
	options: [
		{
			name: "user",
			type: "USER",
			description: "The user you'd like to get information from",
			required: false
		},
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
		const selectedUser = args[0] ? await interaction.guild.members.fetch(args[0]) : interaction.member;

		if (selectedUser) {
			const userinfoMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
				.setAuthor(selectedUser.user.username, selectedUser.user.avatarURL())
				.setThumbnail(selectedUser.user.avatarURL())
				.setTimestamp()
				.addField("ID", '`' + selectedUser.user.id + '`', true)
				.addField("Game", selectedUser.presence ? selectedUser.presence.activities.toString() : "none", true)
				.addField("Joined on", timestamp(selectedUser.joinedAt.getTime()), true)
				.addField("Created on", timestamp(selectedUser.user.createdAt.getTime()), true)
				.addField("Permissions", selectedUser.permissions.toArray().length === 0 ? "No permission" : `${selectedUser.permissions.toArray().length} permissions`, true)
				.addField("Boosting", selectedUser.premiumSince ? `<t:${Math.round(selectedUser.premiumSince.getTime() / 1000)}:d>` : "No", true)
				.addField("Roles", selectedUser.roles.cache.size === 1 ? "No role" : selectedUser.roles.cache.filter(role => role.name !== "@everyone").map(el => el.name).join(", "), false)
				.setColor("RANDOM")
				.setFooter(Client.user.username, Client.user.avatarURL());

			interaction.editReply({ embeds: [userinfoMessageEmbed] });
		} else {
			interaction.editReply("Tagged user is not in the server :frowning:");
		}
	}
}
