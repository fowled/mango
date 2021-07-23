import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest-ts";

// Scratch command

/**
 * Answers with user's message count.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "scmessages",
	description: "Replies with user's message count",
	category: "fun",
	options: [
		{
			name: "username",
			type: "STRING",
			description: "The scratcher's username",
			required: true
		},
	],

	execute(Client: Discord.Client, message: Discord.Message, args, ops) {
		const user: string = args[0];
		const xhttp: XMLHttpRequest = new XMLHttpRequest();

		xhttp.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				const parsedRequest: any = JSON.parse(this.responseText);
				const requestedMessages: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setAuthor(message.member.user.username, message.member.user.avatarURL())
					.setColor("#FF8000")
					.setTitle("Scratch messages information")
					.setDescription(`How many messages does **${user}** have?`)
					.addField("Number of messages", `**${user}** currently has **${parsedRequest.count}** message(s).`)
					.setURL(`https://scratch.mit.edu/users/${user}`)
					.setThumbnail(message.member.user.avatarURL())
					.setTimestamp()
					.setFooter(Client.user.username, Client.user.avatarURL());
				message.reply({ embeds: [requestedMessages] });
			} else if (this.readyState === 4 && this.responseText === "{\"code\":\"NotFound\",\"message\":\"\"}") {
				message.reply("I did not find the user you requested.");
			}
		};
		xhttp.open("GET", `https://api.scratch.mit.edu/users/${user}/messages/count`, true);
		xhttp.send();
	}
}
