import * as Discord from "discord.js";
import * as LogChecker from "../utils/LogChecker";
import * as Logger from "././../utils/Logger";

// Moderation command

/**
 * Bans a user.
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

	const userBan: Discord.User = message.mentions.users.first();
	const memberBan: Discord.GuildMember = message.guild.member(userBan);

	if (memberBan) {
		const banMessageAuthor: string = message.author.tag;
		const banGuildName: string = message.member.guild.name;
		const guildIcon: string = message.member.guild.iconURL();
		const bannedUserId: string = userBan.id;
		const date: Date = new Date();

		if (memberBan.bannable && memberBan.id !== "352158391038377984") {
			const banMessageUser: Discord.MessageEmbed = new Discord.MessageEmbed()
				.setTitle(`Banned!`)
				.setDescription(`You have been banned from the server **${banGuildName}** by *${banMessageAuthor}* on __${date.toLocaleString()}__! Reason: *"${reason}"*`)
				.setTimestamp()
				.setThumbnail(guildIcon)
				.setColor("#4292f4")
				.setFooter(Client.user.username, Client.user.avatarURL());
			Client.users.cache.get(bannedUserId).send(banMessageUser);
		}

		setTimeout(() => {
			if (memberBan.id !== "352158391038377984") {
				memberBan.ban({
					reason,
				}).then(() => {
					const banMessageGuild: Discord.MessageEmbed = new Discord.MessageEmbed()
						.setTitle(`User **${userBan.username}** is now banned!`)
						.setAuthor(message.author.username, message.author.avatarURL())
						.setDescription(`<a:check:690888185084903475> **${memberBan.user.tag}** is now banned (*${reason}*)!`)
						.setTimestamp()
						.setColor("#4292f4")
						.setFooter(Client.user.username, Client.user.avatarURL());
					message.channel.send(banMessageGuild);

					LogChecker.insertLog(Client, message.guild.id, message.author, `**${memberBan.user.tag}** has been __banned__ by ${message.author.tag} for: *${reason}* \nDuration of the punishment: infinite`);

				}).catch((err: any) => {
					const banMessageError: Discord.MessageEmbed = new Discord.MessageEmbed()
						.setTitle("Error")
						.setAuthor(message.author.username, message.author.avatarURL())
						.setDescription(`An error has occured while banning **${memberBan.user.tag}**; missing permissions. Please, I am a serious bot, I can have admin rank!`)
						.setTimestamp()
						.setColor("#FF0000")
						.setFooter(Client.user.username, Client.user.avatarURL());
					message.channel.send(banMessageError);
					Logger.error(err);
				});
			} else {
				const banMessageCreator: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setTitle("Herm...")
					.setAuthor(message.author.username, message.author.avatarURL())
					.setDescription("You can't ban me, I'm the bot developer!")
					.setTimestamp()
					.setThumbnail("")
					.setColor("#FF0000")
					.setFooter(Client.user.username, Client.user.avatarURL());
				message.channel.send(banMessageCreator);
			}
		}, 500);
	} else {
		message.reply("Whoops, please select a member. Ban hammer is waiting!");
	}
}
