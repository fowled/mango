import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";
import * as Logger from "../../utils/Logger";

// Moderation command

/**
 * Bans a user.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "ban",
	description: "Bans a user",
	category: "moderation",
	botPermissions: ["BAN_MEMBERS"],
	memberPermissions: ["BAN_MEMBERS"],
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

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
		const memberBan: Discord.GuildMember = await interaction.guild.members.fetch(args[0]);
		let reason: string = args[1] ?  args[1] : "no reason provided";
		
		if (memberBan) {
			const banMessageAuthor: string = interaction.member.user.tag;
			const banGuildName: string = interaction.member.guild.name;
			const guildIcon: string = interaction.member.guild.iconURL();
			const bannedUserId = memberBan.user.id;
			const date: Date = new Date();

			if (memberBan.bannable && interaction.member.permissions.has(["BAN_MEMBERS"])) {
				const banMessageUser: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setTitle(`Banned!`)
					.setDescription(`You have been banned from the server **${banGuildName}** by *${banMessageAuthor}* on __${date.toLocaleString()}__! Reason: *"${reason}"*`)
					.setTimestamp()
					.setThumbnail(guildIcon)
					.setColor("#4292f4")
					.setFooter(Client.user.username, Client.user.avatarURL());
				Client.users.cache.get(bannedUserId).send({ embeds: [banMessageUser] });
			} else {
				return interaction.reply("<:no:835565213322575963> You need the `BAN_MEMBERS` permission in order to do that.");
			}

			setTimeout(() => {
				memberBan.ban({
					reason,
				}).then(async () => {
					const banMessageGuild: Discord.MessageEmbed = new Discord.MessageEmbed()
						.setTitle(`User **${memberBan.user.username}** is now banned!`)
						.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
						.setDescription(`<:yes:835565213498736650> **${memberBan.user.tag}** is now banned (*${reason}*)!`)
						.setTimestamp()
						.setColor("#4292f4")
						.setFooter(Client.user.username, Client.user.avatarURL());
					interaction.reply({ embeds: [banMessageGuild] });

					LogChecker.insertLog(Client, interaction.guild.id, interaction.member.user, `**${memberBan.user.tag}** has been __banned__ by ${interaction.member.user.tag} for: *${reason}* \nDuration of the punishment: infinite`);

				}).catch(async (err: any) => {
					const banMessageError: Discord.MessageEmbed = new Discord.MessageEmbed()
						.setTitle("Error")
						.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
						.setDescription(`An error has occured while banning **${memberBan.user.tag}**; missing permissions. Please, I am a serious bot, I can have admin rank!`)
						.setTimestamp()
						.setColor("#FF0000")
						.setFooter(Client.user.username, Client.user.avatarURL());
					interaction.reply({ embeds: [banMessageError] });
					Logger.error(err);
				});
			}, 500);
		} else {
			interaction.reply("Whoops, please select a member. Ban hammer is waiting!");
		}
	}
}
