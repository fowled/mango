import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";
import * as Logger from "../../utils/Logger";

// Moderation command

/**
 * Bans a user.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "ban",
	description: "Bans a user",
	category: "moderation",
	options: [
		{
			name: "user",
			type: "USER",
			description: "The user you want to ban",
			required: true
		},

		{
			name: "reason",
			type: "STRING",
			description: "The reason of the ban",
			required: false
		}
	],

	async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
		const memberBan: Discord.GuildMember = message.type === "APPLICATION_COMMAND" ? await message.guild.members.fetch(args[0]) : message.mentions.members.first();
		let reason: string = args[1] ? (message.type === "APPLICATION_COMMAND" ? args[1] : args.slice(1).join(" ")) : "no reason provided";
		
		if (memberBan) {
			const banMessageAuthor: string = message.member.user.tag;
			const banGuildName: string = message.member.guild.name;
			const guildIcon: string = message.member.guild.iconURL();
			const bannedUserId = memberBan.user.id;
			const date: Date = new Date();

			if (memberBan.bannable && message.member.permissions.has(["BAN_MEMBERS"])) {
				const banMessageUser: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setTitle(`Banned!`)
					.setDescription(`You have been banned from the server **${banGuildName}** by *${banMessageAuthor}* on __${date.toLocaleString()}__! Reason: *"${reason}"*`)
					.setTimestamp()
					.setThumbnail(guildIcon)
					.setColor("#4292f4")
					.setFooter(Client.user.username, Client.user.avatarURL());
				Client.users.cache.get(bannedUserId).send({ embeds: [banMessageUser] });
			} else {
				return message.reply("<:no:835565213322575963> You need the `BAN_MEMBERS` permission in order to do that.");
			}

			setTimeout(() => {
				memberBan.ban({
					reason,
				}).then(async () => {
					const banMessageGuild: Discord.MessageEmbed = new Discord.MessageEmbed()
						.setTitle(`User **${memberBan.user.username}** is now banned!`)
						.setAuthor(message.member.user.username, message.member.user.avatarURL())
						.setDescription(`<:yes:835565213498736650> **${memberBan.user.tag}** is now banned (*${reason}*)!`)
						.setTimestamp()
						.setColor("#4292f4")
						.setFooter(Client.user.username, Client.user.avatarURL());
					message.reply({ embeds: [banMessageGuild] });

					LogChecker.insertLog(Client, message.guild.id, message.member.user, `**${memberBan.user.tag}** has been __banned__ by ${message.member.user.tag} for: *${reason}* \nDuration of the punishment: infinite`);

				}).catch(async (err: any) => {
					const banMessageError: Discord.MessageEmbed = new Discord.MessageEmbed()
						.setTitle("Error")
						.setAuthor(message.member.user.username, message.member.user.avatarURL())
						.setDescription(`An error has occured while banning **${memberBan.user.tag}**; missing permissions. Please, I am a serious bot, I can have admin rank!`)
						.setTimestamp()
						.setColor("#FF0000")
						.setFooter(Client.user.username, Client.user.avatarURL());
					message.reply({ embeds: [banMessageError] });
					Logger.error(err);
				});
			}, 500);
		} else {
			message.reply("Whoops, please select a member. Ban hammer is waiting!");
		}
	}
}
