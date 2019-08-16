import * as Discord from "discord.js";
import * as xmlhttprequest from "xmlhttprequest";

// Scratch command

/**
 * Says the current shared projects number on the Scratch website.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const xhttp = new xmlhttprequest();
	xhttp.onreadystatechange = () => {

		if (this.readyState === 4 && this.status === 200) {
			const parsedRequest = JSON.parse(xhttp.responseText);
			message.channel.send(`**${parsedRequest.count}** projects are actually shared on the Scratch website. Meow!`);
		}
	};
	xhttp.open("GET", "https://api.scratch.mit.edu/projects/count/all", true);
	xhttp.send();
}
