import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest";
import * as ScratchAPI from "./../../interfaces/ScratchAPI";

// Scratch command

/**
 * Shows information about a Scratch project.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[]) {
	const project = args[0];
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = () => {

		if (this.readyState === 4 && this.status === 200) {
			let parsedRequest: ScratchAPI.ScratchProject | ScratchAPI.ScratchError = JSON.parse(this.responseText) as ScratchAPI.ScratchProject | ScratchAPI.ScratchError;
			if (Object.hasOwnProperty("code")) {
				parsedRequest = parsedRequest as ScratchAPI.ScratchError;
				if (parsedRequest.code === "NotFound") {
					message.reply("I did not find the project you requested.");
				}
			} else {
				parsedRequest = parsedRequest as ScratchAPI.ScratchProject;
				const requestedProject = new Discord.RichEmbed()
					.setTitle(`Informations sur le projet ${parsedRequest.title}`)
					.setAuthor(message.author.username, message.author.avatarURL)
					.setURL(`https://scratch.mit.edu/projects/${parsedRequest.id}/`)
					.setThumbnail(message.author.avatarURL)
					.setImage(parsedRequest.image)
					.setDescription(parsedRequest.description)
					.addField("Number of :eye:", `**${parsedRequest.stats.views}** views.`)
					.addField("Number of :heart:", `**${parsedRequest.stats.loves}** loves.`)
					.addField("Number of :star:", `**${parsedRequest.stats.favorites}** stars.`)
					.addField("Number of :speech_balloon:", `**${parsedRequest.stats.comments}** comments.`)
					.addField("Number of :cyclone:", `**${parsedRequest.stats.remixes}** remixes.`)
					.addField("Sharing date", "Project shared on **" +
						`${new Date(parsedRequest.history.shared).toLocaleDateString()}` +
						"** at **" +
						`${new Date(parsedRequest.history.shared).toLocaleTimeString()}` +
						"**.")
					.setTimestamp()
					.setColor("#FF8000")
					.setFooter(client.user.username, client.user.avatarURL);
				message.channel.send(requestedProject);
			}
		}
	};

	xhttp.open("GET", `https://api.scratch.mit.edu/projects/${project}/`, true);
	xhttp.send();
}
