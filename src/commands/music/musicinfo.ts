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
	const queue: any = ops.queue.get(message.guild.id);

	const time: any = queue.songs[0].length;
	const minutes: number = Math.floor(time / 60);
	const seconds: number = time - minutes * 60;

	const musicInfoEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.avatarURL())
		.setColor("#f98257")
		.addField("Music name", `:musical_note: - **${queue.songs[0].title}**`)
		.addField("Music asked by?", queue.songs[0].requester)
		.addField("Music creator", `[${queue.songs[0].author.name}](${queue.songs[0].author.channel_url})`)
		.addField("Music length", `${minutes}:${seconds}`)
		.setURL(queue.songs[0].url)
		.setThumbnail(queue.songs[0].author.avatar)
		.setImage(`https://img.youtube.com/vi/${queue.songs[0].id}/hqdefault.jpg`)
		.setFooter(client.user.username, client.user.avatarURL())
		.setTimestamp();
	message.channel.send(musicInfoEmbed);
}

const info = {
    name: "musicinfo",
    description: "Get the currently played music info",
    category: "music",
    args: "none"
}

export { info };
