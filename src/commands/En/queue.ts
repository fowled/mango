import * as Discord from "discord.js";

// Music command

/**
 * Shows the actual guild queue.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const fetched = ops.active.get(message.guild.id);

	if (!fetched) {
		return message.channel.send("No music is currently played! Come join and add some!");
	}

	const queue = fetched.queue;
	const nowPlaying = queue[0];
	let listMessage = "";

	for (let i = 1; i < queue.length; i++) {
		listMessage += `${i}- *${queue[i].songTitle}* - Demandé par **${queue[i].requester}**\n`;
	}

	if (listMessage === undefined) {
		const noQueueMessage = new Discord.RichEmbed()
			.setTitle(`Queue command for ${message.author.tag}`)
			.addField(`Now playing`, `*${nowPlaying.songTitle}* - Asked by **${nowPlaying.requester}**`)
			.setColor("#f98257")
			.setTimestamp()
			.setAuthor(message.author.username, message.author.avatarURL)
			.setFooter(client.user.username, client.user.avatarURL);
		message.channel.send(noQueueMessage);
	} else {
		const withQueueMessage = new Discord.RichEmbed()
			.setTitle(`Queue command ${message.author.tag}`)
			.addField(`Now playing`, `*${nowPlaying.songTitle}* - Asked by **${nowPlaying.requester}**`)
			.addField("Queue", listMessage)
			.setColor("#f98257")
			.setTimestamp()
			.setAuthor(message.author.username, message.author.avatarURL)
			.setFooter(client.user.username, client.user.avatarURL);
		message.channel.send(withQueueMessage);
	}

}
