import * as Discord from "discord.js";
import * as xmlhttprequest from "xmlhttprequest";

// Scratch command

/**
 * Answers with user's message count.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const user: string = args[0];
	const xhttp: any = new xmlhttprequest();
	xhttp.onreadystatechange = () => {

		if (this.readyState === 4 && this.status === 200) {
			const parsedRequest: any = JSON.parse(this.responseText);
			const requestedMessages: Discord.RichEmbed = new Discord.RichEmbed()
				.setAuthor(message.author.username, message.author.avatarURL)
				.setColor("#FF8000")
				.setTitle("Scratch messages information")
				.setDescription(`How many messages does **${user}** have?`)
				.addField("Number of messages", `**${user}** actually has **${parsedRequest.count}** message(s).`)
				.setURL(`https://scratch.mit.edu/users/${user}`)
				.setThumbnail(message.author.avatarURL)
				.setTimestamp()
				.setFooter(Client.user.username, Client.user.avatarURL);
			message.channel.send(requestedMessages);
		} else if (this.readyState === 4 && this.responseText === "{\"code\":\"NotFound\",\"message\":\"\"}") {
			message.reply("I did not find the user you requested.");
		}
	};
	xhttp.open("GET", `https://api.scratch.mit.edu/users/${user}/messages/count`, true);
	xhttp.send();
}
