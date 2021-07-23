import * as Discord from "discord.js";
import { mem } from "systeminformation";
import * as LogChecker from "../../utils/LogChecker";

// Moderation command

/**
 * Kicks user.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "kick",
	description: "Kicks a user",
	category: "moderation",
	options: [
		{
			name: "user",
			type: "USER",
			description: "The user you want to kick",
			required: true
		},

		{
			name: "reason",
			type: "STRING",
			description: "The reason of the kick",
			required: false
		}
	],

	async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
		const memberKick: Discord.GuildMember = message.type === "APPLICATION_COMMAND" ? await message.guild.members.fetch(args[0]) : message.mentions.members.first();
		let reason: string = args[1] ? (message.type === "APPLICATION_COMMAND" ? args[1] : args.slice(1).join(" ")) : "no reason provided";

		if (memberKick) {
			const kickMessageAuthor: string = message.member.user.username;
			const kickGuildName: string = message.member.guild.name;
			const guildIcon: string = message.member.guild.iconURL();
			const date: Date = new Date();

			if (memberKick.kickable && message.member.permissions.has(["KICK_MEMBERS"])) {
				const kickMessageUser: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setTitle(`Kicked!`)
					.setDescription(`You have been kicked from the server **${kickGuildName}** by *${kickMessageAuthor}* on date __${date.toLocaleDateString()}__ ! Reason: *"${reason}"*`)
					.setTimestamp()
					.setThumbnail(guildIcon)
					.setColor("#4292f4")
					.setFooter(Client.user.username, Client.user.avatarURL());
				memberKick.send({ embeds: [kickMessageUser] });
			} else {
				return message.reply("<:no:835565213322575963> You need the `KICK_MEMBERS` permission in order to do that.");
			}

			setTimeout(async () => {
				await memberKick.kick(reason).then(async () => {
					const kickMessageGuild: Discord.MessageEmbed = new Discord.MessageEmbed()
						.setTitle(`User ${memberKick.user.username} has been kicked from the guild!`)
						.setAuthor(message.member.user.username, message.member.user.avatarURL())
						.setDescription(`<:yes:835565213498736650> **${memberKick.user.tag}** is now kicked (*${reason}*)!`)
						.setTimestamp()
						.setColor("#4292f4")
						.setFooter(Client.user.username, Client.user.avatarURL());
					message.reply({ embeds: [kickMessageGuild] });

					LogChecker.insertLog(Client, message.guild.id, message.member.user, `**${memberKick.user.tag}** has been __kicked__ by ${message.member.user.tag} for: *${reason}* \nDuration of the punishment: infinite`);
				}).catch((err: any) => {
					const kickMessageError: Discord.MessageEmbed = new Discord.MessageEmbed()
						.setTitle("Error")
						.setAuthor(message.member.user.username, message.member.user.avatarURL())
						.setDescription(`An error has occured while kicking **${memberKick.user.tag}**; missing permissions. Make sure I have admin perms, then I promise I'll take the hammer!`)
						.setTimestamp()
						.setColor("#FF0000")
						.setFooter(Client.user.username, Client.user.avatarURL());
					message.reply({ embeds: [kickMessageError] });
				});
			}, 750);
		} else {
			message.reply("Boop! A super rare unknown error has occured. Maybe the user you tried to kick isn't in the server...?");
		}

	}
}


const info = {
	name: "kick",
	description: "Kick a member",
	category: "moderation",
	args: "[@user] (reason)"
}

export { info };
