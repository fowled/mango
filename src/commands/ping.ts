import * as Discord from "discord.js";

// Test command

/**
 * Tests the bot ping.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const ping: Discord.Message = await message.channel.send("Ping?") as Discord.Message;

	const pong: Discord.MessageEmbed = new Discord.MessageEmbed()
		.setTitle(`Latency information for ${message.author.tag}`)
		.setAuthor(message.author.username, message.author.avatar)
		.setColor(Math.floor(Math.random() * 16777214) + 1)
		.setDescription("Latency information")
		.addField("API latency", `**${Math.round(client.ws.ping)}** ms.`, true)
		.setFooter(client.user.username, client.user.avatar)
		.setTimestamp();

	ping.edit(pong);
}
