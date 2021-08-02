import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest-ts";

// Scratch command

/**
 * Answers with user's message count.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "scmessages",
	description: "Replies with user's message count",
	category: "api",
	options: [
		{
			name: "username",
			type: "STRING",
			description: "The scratcher's username",
			required: true
		},
	],

	execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
		const user: string = args[0];
		const xhttp: XMLHttpRequest = new XMLHttpRequest();

		xhttp.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				const parsedRequest: any = JSON.parse(this.responseText);
				const requestedMessages: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
					.setColor("#FF8000")
					.setTitle("Scratch messages information")
					.setDescription(`How many messages does **${user}** have?`)
					.addField("Number of messages", `**${user}** currently has **${parsedRequest.count}** message(s).`)
					.setURL(`https://scratch.mit.edu/users/${user}`)
					.setThumbnail(interaction.member.user.avatarURL())
					.setTimestamp()
					.setFooter(Client.user.username, Client.user.avatarURL());
				interaction.reply({ embeds: [requestedMessages] });
			} else if (this.readyState === 4 && this.responseText === "{\"code\":\"NotFound\",\"message\":\"\"}") {
				interaction.reply("I did not find the user you requested.");
			}
		};
		xhttp.open("GET", `https://api.scratch.mit.edu/users/${user}/messages/count`, true);
		xhttp.send();
	}
}
