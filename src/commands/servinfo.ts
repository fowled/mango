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

	if (message.member.guild.afkChannel) {
		afkChannel = `#<${message.member.guild.afkChannel}>`;
	} else {
		afkChannel = "None.";
	}

	const reponse: Discord.MessageEmbed = new Discord.MessageEmbed()
		.setTitle(`Server info for ${message.author.username}`)
		.setThumbnail(guildPicture)
		.setAuthor(`${message.author.username}`, message.author.avatarURL())
		.setColor(Math.floor(Math.random() * 16777214) + 1)
		.addField("Members", `${message.member.guild.members.cache.filter((member: Discord.GuildMember) => !member.user.bot).size} humans and ${message.member.guild.members.cache.filter((member: Discord.GuildMember) => member.user.bot).size} bots`, true)
		.addField("Channels", `${message.member.guild.channels.cache.filter((channel: Discord.TextChannel) => channel.type === "text").size} textual and ${message.member.guild.channels.cache.filter((channel: Discord.VoiceChannel) => channel.type === "voice").size} vocal`, true)
		.addField("Owner", message.member.guild.owner, true)
		.addField("Region", message.member.guild.region, true)
		.addField("Created on", message.member.guild.createdAt.toLocaleDateString(), true)
		.addField("AFK channel", afkChannel, true)
		.setFooter(Client.user.username, Client.user.avatarURL())
		.setTimestamp();
	message.channel.send(reponse);
}
