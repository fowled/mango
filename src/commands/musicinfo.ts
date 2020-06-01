import * as Discord from "discord.js";

// Music command

/**
 * Asnwers with the actual guild music information.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const fetched: any = ops.active.get(message.guild.id);

	const parseURL: any = fetched.queue[0].url.split("watch?v=")[1];

	const time: any = fetched.queue[0].songLength;
	const minutes: number = Math.floor(time / 60);
	const seconds: number = time - minutes * 60;

	const musicInfoEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.avatar)
		.setTitle(`Information for ${message.author.tag}`)
		.setColor("#f98257")
		.addField("Music name", `:musical_note: - **${fetched.queue[0].songTitle}**`)
		.addField("Music asked by?", `*${fetched.queue[0].requester}*`)
		.addField("Music creator", fetched.queue[0].songAuthor)
		.addField("Music length", `${minutes} minute(s) et ${seconds} secondes.`)
		.addField("Announcement channel", `Channel <#${fetched.queue[0].announceChannel}>`)
		.setURL(`https://youtube.com/${fetched.queue[0].url}`)
		.setThumbnail(`https://img.youtube.com/vi/${parseURL}/0.jpg`)
		.setFooter(client.user.username, client.user.avatar)
		.setTimestamp();
	message.channel.send(musicInfoEmbed);
}
