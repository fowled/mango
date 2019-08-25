import * as Discord from "discord.js";
import * as Logger from "./../../utils/Logger";

// Moderation command

export function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	let reason = message.content.split(" ").slice(2).join(" ");

	if (reason === "") {
		reason = "No reason provided";
	}

	const userBan = message.mentions.users.first();
	const memberBan = message.guild.member(userBan);

	if (memberBan) {
		const banMessageAuthor = message.author.tag;
		const banGuildName = message.member.guild.name;
		const guildIcon = message.member.guild.iconURL;
		const bannedUserId = userBan.id;
		const date = new Date();

		if (memberBan.bannable && memberBan.id !== "352158391038377984") {
			const banMessageUser = new Discord.RichEmbed()
				.setTitle(`Banned!`)
				.setDescription(`You have been banned from the server **${banGuildName}** by *${banMessageAuthor}* on date __${date.toLocaleTimeString()}__! Reason: *"${reason}"*`)
				.setTimestamp()
				.setThumbnail(guildIcon)
				.setColor("#4292f4")
				.setFooter(Client.user.username, Client.user.avatarURL);
			Client.users.get(bannedUserId).send(banMessageUser);
		}

		setTimeout(() => {
			if (memberBan.id !== "352158391038377984") {
				memberBan.ban({
					reason,
				}).then(() => {
					const banMessageGuild = new Discord.RichEmbed()
						.setTitle(`User **${userBan.username}** is now banned!`)
						.setAuthor(message.author.username, message.author.avatarURL)
						.setDescription(`:white_check_mark: **${memberBan.user.tag}** is now banned (*${reason}*)!`)
						.setTimestamp()
						.setColor("#4292f4")
						.setFooter(Client.user.username, Client.user.avatarURL);
					message.channel.send(banMessageGuild);

				}).catch((err: any) => {
					const banMessageError = new Discord.RichEmbed()
						.setTitle("Error")
						.setAuthor(message.author.username, message.author.avatarURL)
						.setDescription(`An error has occured while banning **${memberBan.user.tag}**; missing permissions. Please, I am a serious bot, I can have admin rank!`)
						.setTimestamp()
						.setColor("#FF0000")
						.setFooter(Client.user.username, Client.user.avatarURL);
					message.channel.send(banMessageError);
					Logger.error(err);
				});
			} else {
				const banMessageCreator = new Discord.RichEmbed()
					.setTitle("Herm...")
					.setAuthor(message.author.username, message.author.avatarURL)
					.setDescription("You can't ban me, I'm the bot developer!")
					.setTimestamp()
					.setThumbnail("")
					.setColor("#FF0000")
					.setFooter(Client.user.username, Client.user.avatarURL);
				message.channel.send(banMessageCreator);
			}
		}, 500);
	} else {
		message.reply("Whoops, please select a member. Ban hammer is waiting!");
	}
}
