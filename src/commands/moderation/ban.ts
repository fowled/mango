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
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	let reason: string = message.content.split(" ").slice(2).join(" ");

	if (reason === "") {
		reason = "No reason provided";
	}

	const userBan: Discord.User = message.mentions.users.first();
	const memberBan: Promise<Discord.GuildMember> = message.guild.members.fetch(userBan);

	if (memberBan) {
		const banMessageAuthor: string = message.member.user.tag;
		const banGuildName: string = message.member.guild.name;
		const guildIcon: string = message.member.guild.iconURL();
		const bannedUserId = userBan.id;
		const date: Date = new Date();

		if ((await memberBan).bannable && message.member.permissions.has("BAN_MEMBERS")) {
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
			memberBan.then(user => user.ban(({
				reason,
			})).then(async () => {
				const banMessageGuild: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setTitle(`User **${userBan.username}** is now banned!`)
					.setAuthor(message.member.user.username, message.member.user.avatarURL())
					.setDescription(`<:yes:835565213498736650> **${(await memberBan).user.tag}** is now banned (*${reason}*)!`)
					.setTimestamp()
					.setColor("#4292f4")
					.setFooter(Client.user.username, Client.user.avatarURL());
				message.reply({ embeds: [banMessageGuild] });

				LogChecker.insertLog(Client, message.guild.id, message.member.user, `**${(await memberBan).user.tag}** has been __banned__ by ${message.member.user.tag} for: *${reason}* \nDuration of the punishment: infinite`);

			}).catch(async (err: any) => {
				const banMessageError: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setTitle("Error")
					.setAuthor(message.member.user.username, message.member.user.avatarURL())
					.setDescription(`An error has occured while banning **${(await memberBan).user.tag}**; missing permissions. Please, I am a serious bot, I can have admin rank!`)
					.setTimestamp()
					.setColor("#FF0000")
					.setFooter(Client.user.username, Client.user.avatarURL());
				message.reply({ embeds: [banMessageError] });
				Logger.error(err);
			}));
		}, 500);
	} else {
		message.reply("Whoops, please select a member. Ban hammer is waiting!");
	}
}

const info = {
	name: "ban",
	description: "Ban a member",
	category: "moderation",
	args: "[@user] (reason)"
}

export { info };
