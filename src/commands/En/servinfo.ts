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
	let afkChannel;
	const guildPicture = message.member.guild.iconURL;

	if (message.member.guild.afkChannel) {
		afkChannel = `#<${message.member.guild.afkChannel}>`;
	} else {
		afkChannel = "No AFK channel.";
	}

	const reponse = new Discord.RichEmbed()
		.setTitle(`Informations serveur pour ${message.author.username}`)
		.setThumbnail(guildPicture)
		.setAuthor(`${message.author.username}`, message.author.avatarURL)
		.setDescription(`Informations à propos du serveur Discord ${message.member.guild.name} :`)
		.setColor(Math.floor(Math.random() * 16777214) + 1)
		.addField("Membres", `${message.member.guild.members.filter((member: Discord.GuildMember) => !member.user.bot).size} humains et ${message.member.guild.members.filter((member: Discord.GuildMember) => member.user.bot).size} bots`, true)
		.addField("Channels", `${message.member.guild.channels.filter((channel: Discord.TextChannel) => channel.type === "text").size} textuels et ${message.member.guild.channels.filter((channel: Discord.VoiceChannel) => channel.type === "voice").size} vocaux`, true)
		.addField("Propriétaire", message.member.guild.owner, true)
		.addField("Région", message.member.guild.region, true)
		.addField("Création", message.member.guild.createdAt.toLocaleString(), true)
		.addField("Channel AFK", afkChannel, true)
		.setFooter(Client.user.username, Client.user.avatarURL)
		.setTimestamp();
	message.channel.send(reponse);
}
