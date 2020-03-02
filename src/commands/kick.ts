import * as Discord from "discord.js";

// Moderation command

/**
 * Kicks user.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const user: Discord.User = message.mentions.users.first();
	if (user) {
		const member: Discord.GuildMember = message.guild.member(user);
		let reason: string = message.content.split(" ").slice(2).join(" ");

		if (reason === "") {
			reason = "No reason provided";
		}

		if (member) {
			const kickMessageAuthor: string = message.author.username;
			const kickGuildName: string = message.member.guild.name;
			const guildIcon: string = message.member.guild.iconURL;
			const kickedUserId: string = user.id;
			const date: Date = new Date();
			if (member.kickable && member.id !== "352158391038377984") {
				const kickMessageUser: Discord.RichEmbed = new Discord.RichEmbed()
					.setTitle(`Kicked!`)
					.setDescription(`You have been kicked from the server **${kickGuildName}** by *${kickMessageAuthor}* on date __${date.toLocaleDateString()}__ ! Reason: *"${reason}"*`)
					.setTimestamp()
					.setThumbnail(guildIcon)
					.setColor("#4292f4")
					.setFooter(Client.user.username, Client.user.avatarURL);
				Client.users.get(kickedUserId).send(kickMessageUser);
			}

			setTimeout(() => {
				member.kick(reason).then(() => {
					const kickMessageGuild: Discord.RichEmbed = new Discord.RichEmbed()
						.setTitle(`User ${user.username} has been kicked from the guild!`)
						.setAuthor(message.author.username, message.author.avatarURL)
						.setDescription(`:white_check_mark: **${user.tag}** is now kicked (*${reason}*)!`)
						.setTimestamp()
						.setColor("#4292f4")
						.setFooter(Client.user.username, Client.user.avatarURL);
					message.channel.send(kickMessageGuild);
				}).catch((err: any) => {
					const kickMessageError: Discord.RichEmbed = new Discord.RichEmbed()
						.setTitle("Error")
						.setAuthor(message.author.username, message.author.avatarURL)
						.setDescription(`An error has occured while kicking **${user.tag}**; missing permissions. Make sure I have admin perms, then I promise I'll take the hammer!`)
						.setTimestamp()
						.setColor("#FF0000")
						.setFooter(Client.user.username, Client.user.avatarURL);
					message.channel.send(kickMessageError);
					// il faut require le logger en haut du fichier, et aussi changer la fonction "exports"
				});
			}, 750);
		} else {
			message.reply("Boop! A super rare unknown error has occured. Maybe the user you tried to kick isn't in the server...?");
		}
	} else {
		message.reply("Please select a member :wink:");
	}

}
