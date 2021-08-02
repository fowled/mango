import * as Discord from "discord.js";

// Member command

/**
 * Shows information about a server.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "servinfo",
	description: "Get useful information from a server",
	category: "info",

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {

		let afkChannel: any;
		const guildPicture: string = interaction.member.guild.iconURL();

		/**
		 * NOTE: Due to some changes to the Discord API (see gateway intents) some lines of code have been disabled to prevent the bot from no longer working properly.
		 */

		if (interaction.member.guild.afkChannel) {
			afkChannel = `#<${interaction.member.guild.afkChannel}>`;
		} else {
			afkChannel = "None.";
		}

		const reponse: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setThumbnail(guildPicture)
			.setAuthor(`${interaction.guild.name}`, guildPicture)
			.setColor("RANDOM")
			.addField(`**${interaction.member.guild.channels.cache.size}** channels`, `• Text: **${interaction.member.guild.channels.cache.filter((channel: Discord.TextChannel) => channel.type === "GUILD_TEXT").size}** \n• Voice: **${interaction.member.guild.channels.cache.filter((channel: Discord.VoiceChannel) => channel.type === "GUILD_VOICE").size}**`, true)
			.addField("Owner", (await interaction.member.guild.fetchOwner()).user.username, true)
			.addField("Created on", interaction.member.guild.createdAt.toLocaleDateString(), true)
			.addField("Verification", interaction.member.guild.verificationLevel, true)
			.addField("Boosts", `**${interaction.member.guild.premiumSubscriptionCount}**`, true)
			.addField("Roles", `**${interaction.guild.roles.cache.size}**`, true)
			.addField("AFK", afkChannel, true)
			// .addField("Presence", `• <:online:746276053177073715> Online - **${interaction.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "online").size}** users \n• <:idle:746276053055438938> Idle - **${interaction.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "idle").size}** users \n• <:dnd:746276052824883232> DND - **${interaction.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "dnd").size}** users \n• <:offline:745904190962008148> Offline - **${interaction.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "offline").size}** users`)
			.setFooter(Client.user.username, Client.user.avatarURL())
			.setTimestamp();

		if (interaction.guild.banner) {
			reponse.setImage(interaction.guild.bannerURL());
		}

		interaction.reply({ embeds: [reponse] });
	}
}

