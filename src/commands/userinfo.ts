import * as Discord from "discord.js";

// Member command

/**
 * Shows some user information.
 * @param {Discord.Client} Client le client
 * @param {Discord.Message} Message le message contenant la commande
 * @param {string[]} args les arguments de la commande
 * @param {any} options les options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any): Promise<void> {
	const selectedUser: Discord.GuildMember = message.mentions.users.size > 0 ? (message.guild.member(message.mentions.members.first()) ? message.mentions.members.first() : null) : message.member;
	if (selectedUser) { // In the same server
		const userinfoMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setTitle(`User information for ${selectedUser.user.username}`)
			.setAuthor(selectedUser.user.username, selectedUser.user.avatarURL())
			.setThumbnail(selectedUser.user.avatarURL())
			.setTimestamp()
			.addField("Username", selectedUser.user.username, true)
			.addField("Tag", selectedUser.user.discriminator, true)
			.addField("Status", selectedUser.presence.status, true)
			.addField("Game", selectedUser.presence.activities.join(" ; ") ? !selectedUser.presence.activities.join("") : "None", true)
			.addField("Joined on", message.guild.member(selectedUser).joinedAt.toLocaleDateString(), true)
			.addField("Roles", message.guild.member(selectedUser).roles.cache.array().splice(1).map((role: Discord.Role) => role.name).length === 0 ? "No role" : message.guild.member(selectedUser).roles.cache.array().splice(1).map((role: Discord.Role) => role.name).join(", "), true)
			.addField("Created on", selectedUser.user.createdAt.toLocaleDateString(), true)
			.addField("Nickname", selectedUser.nickname ? selectedUser.nickname : "No", true)
			.addField("Boost", selectedUser.premiumSince ? selectedUser.premiumSince.toLocaleString() : "No", true)
			.setColor(Math.floor(Math.random() * 16777214) + 1)
			.setFooter(Client.user.username, Client.user.avatarURL());

		message.channel.send(userinfoMessageEmbed);
	} else {
		message.channel.send("Tagged user is not in the server :frowning:");
	}
}
