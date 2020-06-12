import * as Discord from "discord.js";

// Commande relative aux membres/serveur

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

	let region = {
		"brazil": ":flag_br:",
		"eu-central": ":flag_eu:",
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
		.setColor(Math.floor(Math.random() * 16777214) + 1)
		.addField(`**${message.member.guild.members.cache.size}** members`, `• Humans: **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => !member.user.bot).size}** \n• Bots: **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.bot).size}**`, true)
		.addField(`**${message.member.guild.channels.cache.size}** channels`, `• Text: **${message.member.guild.channels.cache.filter((channel: Discord.TextChannel) => channel.type === "text").size}** \n• Voice: **${message.member.guild.channels.cache.filter((channel: Discord.VoiceChannel) => channel.type === "voice").size}**`, true)
		.addField("Owner", message.member.guild.owner, true)
		.addField("Region", region[message.member.guild.region], true)
		.addField("Created on", message.member.guild.createdAt.toLocaleDateString(), true)
		.addField("Boosts", `**${message.member.guild.premiumSubscriptionCount}**`, true)
		.addField("Verification", message.member.guild.verificationLevel, true)
		.addField("Presence", `• <:online:720998984646262834> Online - **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "online").size}** users \n• <:idle:720998984402993162> Idle - **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "idle").size}** users \n• <:dnd:720998984188952577> DND - **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "dnd").size}** users \n• <:offline:720998984465907883> Offline - **${message.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.presence.status == "offline").size}** users`)
		.addField("Roles", message.member.guild.roles.cache.array().join(", "))
		.setFooter(Client.user.username, Client.user.avatarURL())
		.setTimestamp();

		if (message.guild.banner) {
			reponse.setImage(message.guild.bannerURL());
		}

	message.channel.send(reponse);
}
