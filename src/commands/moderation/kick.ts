import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";

// Moderation command

/**
 * Kicks user.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	let reason: string = message.content.split(" ").slice(2).join(" ");
	
	if (reason === "") {
		reason = "No reason provided";
	}

	const user: Discord.User = message.mentions.users.first();
	const member: Discord.GuildMember = message.guild.member(user);

	if (member) {
		const kickMessageAuthor: string = message.author.username;
		const kickGuildName: string = message.member.guild.name;
		const guildIcon: string = message.member.guild.iconURL();
		const date: Date = new Date();

		if (member.kickable && message.member.hasPermission("KICK_MEMBERS")) {
			const kickMessageUser: Discord.MessageEmbed = new Discord.MessageEmbed()
				.setTitle(`Kicked!`)
				.setDescription(`You have been kicked from the server **${kickGuildName}** by *${kickMessageAuthor}* on date __${date.toLocaleDateString()}__ ! Reason: *"${reason}"*`)
				.setTimestamp()
				.setThumbnail(guildIcon)
				.setColor("#4292f4")
				.setFooter(Client.user.username, Client.user.avatarURL());
			user.send(kickMessageUser);
		} else {
			return message.channel.send("<a:nocheck:691001377459142718> You need the `KICK_MEMBERS` permission in order to do that.");
		}

		setTimeout(() => {
			member.kick(reason).then(() => {
				const kickMessageGuild: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setTitle(`User ${user.username} has been kicked from the guild!`)
					.setAuthor(message.author.username, message.author.avatarURL())
					.setDescription(`<a:check:690888185084903475> **${user.tag}** is now kicked (*${reason}*)!`)
					.setTimestamp()
					.setColor("#4292f4")
					.setFooter(Client.user.username, Client.user.avatarURL());
				message.channel.send(kickMessageGuild);

				LogChecker.insertLog(Client, message.guild.id, message.author, `**${member.user.tag}** has been __kicked__ by ${message.author.tag} for: *${reason}* \nDuration of the punishment: infinite`);
			}).catch((err: any) => {
				const kickMessageError: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setTitle("Error")
					.setAuthor(message.author.username, message.author.avatarURL())
					.setDescription(`An error has occured while kicking **${user.tag}**; missing permissions. Make sure I have admin perms, then I promise I'll take the hammer!`)
					.setTimestamp()
					.setColor("#FF0000")
					.setFooter(Client.user.username, Client.user.avatarURL());
				message.channel.send(kickMessageError);
			});
		}, 750);
	} else {
		message.reply("Boop! A super rare unknown error has occured. Maybe the user you tried to kick isn't in the server...?");
	}

}
