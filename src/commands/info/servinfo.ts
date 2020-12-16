import * as Discord from "discord.js";

// Member command

/**
 * Shows information about a server.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[]) {
	let afkChannel: any;
	const guildPicture: string = message.member.guild.iconURL();

	/**
	 * NOTE: Due to some changes to the Discord API (see gateway intents) some lines of code have been disabled to prevent the bot from no longer working properly.
	 */

	if (message.member.guild.afkChannel) {
		afkChannel = `#<${message.member.guild.afkChannel}>`;
	} else {
		afkChannel = "None.";
	}

	let region = {
		"brazil": ":flag_br:",
		"europe": ":flag_eu:",
		"singapore": ":flag_sg:",
		"us-central": ":flag_us:",
		"sydney": ":flag_au:",
		"us-east": ":flag_us:",
		"us-south": ":flag_us:",
		"us-west": ":flag_us:",
		"eu-west": ":flag_eu:",
		"vip-us-east": ":flag_us:",
		"london": ":flag_gb:",
		"amsterdam": ":flag_nl:",
		"hongkong": ":flag_hk:",
		"russia": ":flag_ru:",
		"southafrica": ":flag_za:"
	};

	const reponse: Discord.MessageEmbed = new Discord.MessageEmbed()
		.setTitle(`${message.guild.name} - ${message.guild.id}`)
		.setThumbnail(guildPicture)
		.setAuthor(`${message.author.username}`, message.author.avatarURL())
		.setColor("RANDOM")
		.addField(`**${message.member.guild.members.cache.size}** members`, `• Humans: **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => !member.user.bot).size}** \n• Bots: **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.bot).size}**`, true)
		.addField(`**${message.member.guild.channels.cache.size}** channels`, `• Text: **${message.member.guild.channels.cache.filter((channel: Discord.TextChannel) => channel.type === "text").size}** \n• Voice: **${message.member.guild.channels.cache.filter((channel: Discord.VoiceChannel) => channel.type === "voice").size}**`, true)
		.addField("Owner", message.member.guild.owner, true)
		.addField("Region", region[message.member.guild.region], true)
		.addField("Created on", message.member.guild.createdAt.toLocaleDateString(), true)
		.addField("Verification", message.member.guild.verificationLevel, true)
		.addField("Boosts", `**${message.member.guild.premiumSubscriptionCount}**`, true)
		.addField("Roles", `**${message.guild.roles.cache.size}**`, true)
		.addField("AFK", afkChannel, true)
		// .addField("Presence", `• <:online:746276053177073715> Online - **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "online").size}** users \n• <:idle:746276053055438938> Idle - **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "idle").size}** users \n• <:dnd:746276052824883232> DND - **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "dnd").size}** users \n• <:offline:745904190962008148> Offline - **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "offline").size}** users`)
		.setFooter(Client.user.username, Client.user.avatarURL())
		.setTimestamp();

		if (message.guild.banner) {
			reponse.setImage(message.guild.bannerURL());
		}

	message.channel.send(reponse);
}
