import * as Discord from "discord.js";
import { replyMsg } from "../../utils/InteractionAdapter";

// Test command

/**
 * Tests the bot ping.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "ping",
	description: "Get info on Mango's latency",
	category: "info",

	async execute(Client: Discord.Client, message: Discord.Message & Discord.CommandInteraction, args, ops) {
		let ping = await message.reply("Ping?");

		if (message.type === "APPLICATION_COMMAND") {
			ping = await message.fetchReply() as unknown as Discord.Message;
		}

		const pong: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setTitle(`Latency information for ${message.member.user.tag}`)
			.setAuthor(message.member.user.username, message.member.user.avatarURL())
			.setColor("RANDOM")
			.setDescription("Latency information")
			.addField("Host latency", `**${Math.floor(ping.createdTimestamp - message.createdTimestamp)}** ms.`)
			.addField("API latency", `**${Math.round(Client.ws.ping)}** ms.`, true)
			.setFooter(Client.user.username, Client.user.avatarURL())
			.setTimestamp();

		replyMsg(message, { embeds: [pong] }, ping, true);
	}
}
