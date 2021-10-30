import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";

// Moderation command

/**
 * Kicks user.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "kick",
	description: "Kicks a user",
	category: "moderation",
	botPermissions: ["KICK_MEMBERS"],
	memberPermissions: ["KICK_MEMBERS"],
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

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
		const memberKick: Discord.GuildMember = await interaction.guild.members.fetch(args[0]);
		const reason: string = args[1] ? args[1] : "no reason provided";

		if (memberKick) {
			const kickMessageAuthor: string = interaction.member.user.username;
			const kickGuildName: string = interaction.member.guild.name;
			const guildIcon: string = interaction.member.guild.iconURL();
			const date: Date = new Date();

			const kickMessageUser: Discord.MessageEmbed = new Discord.MessageEmbed()
				.setTitle(`Kicked!`)
				.setDescription(`You have been kicked from the server **${kickGuildName}** by *${kickMessageAuthor}* on date __${date.toLocaleDateString()}__ ! Reason: *"${reason}"*`)
				.setTimestamp()
				.setThumbnail(guildIcon)
				.setColor("#4292f4")
				.setFooter(Client.user.username, Client.user.avatarURL());
			memberKick.send({ embeds: [kickMessageUser] });

			setTimeout(async () => {
				await memberKick.kick(reason).then(async () => {
					const kickMessageGuild: Discord.MessageEmbed = new Discord.MessageEmbed()
						.setTitle(`User ${memberKick.user.username} has been kicked from the guild!`)
						.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
						.setDescription(`<:yes:835565213498736650> **${memberKick.user.tag}** is now kicked (*${reason}*)!`)
						.setTimestamp()
						.setColor("#4292f4")
						.setFooter(Client.user.username, Client.user.avatarURL());
					interaction.editReply({ embeds: [kickMessageGuild] });

					LogChecker.insertLog(Client, interaction.guild.id, interaction.member.user, `**${memberKick.user.tag}** has been __kicked__ by ${interaction.member.user.tag} for: *${reason}* \nDuration of the punishment: infinite`);
				}).catch(() => {
					const kickMessageError: Discord.MessageEmbed = new Discord.MessageEmbed()
						.setTitle("Error")
						.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
						.setDescription(`An error has occured while kicking **${memberKick.user.tag}**; missing permissions. Make sure I have admin perms, then I promise I'll take the hammer!`)
						.setTimestamp()
						.setColor("#FF0000")
						.setFooter(Client.user.username, Client.user.avatarURL());
					interaction.editReply({ embeds: [kickMessageError] });
				});
			}, 750);
		} else {
			interaction.editReply("Boop! A super rare unknown error has occured. Maybe the user you tried to kick isn't in the server...?");
		}

	}
}
