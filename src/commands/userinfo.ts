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
	const selectedUser: Discord.User = message.mentions.users.size > 0 ? (message.guild.member(message.mentions.users.first()) ? message.mentions.users.first() : null) : message.author;
	if (selectedUser) { // In the same server
		const userinfoMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setTitle(`User information for ${selectedUser.username}`)
			.setAuthor(selectedUser.username, selectedUser.avatar)
			.setDescription(`User information [${selectedUser.id}]`)
			.setThumbnail(selectedUser.avatar)
			.setTimestamp()
			.addField("Username", selectedUser.username, true)
			.addField("Tag", selectedUser.discriminator, true)
			.addField("Status", selectedUser.presence.status, true)
			.addField("Game", selectedUser.presence.game ? selectedUser.presence.game.name : "None", true)
		if (message.guild.member(message.mentions.users.first())) {
			userinfoMessageEmbed.addField("Joined on", message.guild.member(selectedUser).joinedAt.toLocaleDateString(), true)
				.addField("Roles", message.guild.member(selectedUser).roles.array().splice(1).map((role: Discord.Role) => role.name).length === 0 ? "No role" : message.guild.member(selectedUser).roles.array().splice(1).map((role: Discord.Role) => role.name).join(", "));
		}
		userinfoMessageEmbed.addField("Created on:", selectedUser.createdAt.toLocaleDateString(), true)
			.setColor(Math.floor(Math.random() * 16777214) + 1)
			.setFooter(Client.user.username, Client.user.avatar);

		message.channel.send(userinfoMessageEmbed);
	} else {
		message.channel.send("Tagged user is not in the server :frowning:");
	}
}
