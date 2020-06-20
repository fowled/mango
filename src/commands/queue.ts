import * as Discord from "discord.js";

// Music command

/**
 * Shows the actual guild music queue.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const serverQueue = await ops.queue.get(message.guild.id);

	if (!serverQueue) {
		return message.channel.send("No music is currently played! Come join and add some!");
	}

	let queue = "";

	for (let i = 0; i < serverQueue.songs.length; i++) {
	    queue += `${i + 1}. [${serverQueue.songs[i].title}](${serverQueue.songs[i].url}) \n`;
	}

	const embed = new Discord.MessageEmbed()
		.setAuthor(message.author.username, message.author.avatarURL())
		.addField("Queue", queue)
		.setColor("#06A8F9")
		.setTimestamp()
		.setFooter(Client.user.username, Client.user.avatarURL())
	message.channel.send(embed);
}
