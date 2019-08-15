import * as Discord from "discord.js";

// Music command

export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const fetched = ops.active.get(message.guild.id);

	const parseURL = fetched.queue[0].url.split("watch?v=")[1];

	const time = fetched.queue[0].songLength;
	const minutes = Math.floor(time / 60);
	const seconds = time - minutes * 60;

	const musicInfoEmbed = new Discord.RichEmbed()
		.setAuthor(message.author.username, message.author.avatarURL)
		.setTitle(`Information for ${message.author.tag}`)
		.setColor("#f98257")
		.addField("Music name", `:musical_note: - **${fetched.queue[0].songTitle}**`)
		.addField("Music asked by?", `*${fetched.queue[0].requester}*`)
		.addField("Music creator", fetched.queue[0].songAuthor)
		.addField("Music length", `${minutes} minute(s) et ${seconds} secondes.`)
		.addField("Announcement channel", `Channel <#${fetched.queue[0].announceChannel}>`)
		.setURL(`https://youtube.com/${fetched.queue[0].url}`)
		.setThumbnail(`https://img.youtube.com/vi/${parseURL}/0.jpg`)
		.setFooter(client.user.username, client.user.avatarURL)
		.setTimestamp();
	message.channel.send(musicInfoEmbed);
}
