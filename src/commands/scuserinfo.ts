import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest";

// Scratch command

/**
 * Shows information about a Scratch user.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const user: string = args[0];
	const xhttp: any = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			const requestedUser = JSON.parse(xhttp.responseText);
			let scratchTeam: any;
			let status: any = requestedUser.profile.status;
			let bio: any = requestedUser.profile.bio;
			const monthDate: any = requestedUser.history.joined.split("T")[0];
			const hourDate: any = requestedUser.history.joined.split("T")[1].split(".000")[0];

			if (requestedUser.scratchteam === false) {
				scratchTeam = "No.";
			} else if (requestedUser.scratchteam === true) {
				scratchTeam = "Yep.";
			}

			if (requestedUser.profile.status === "" || checkLines(requestedUser.profile.status.toString())) {
				status = "No status provided...";
			}

			if (requestedUser.profile.bio === "" || checkLines(requestedUser.profile.bio.toString())) {
				bio = "No bio provided...";
			}

			const reponse: Discord.MessageEmbed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL())
				.setColor("#FF8000")
				.setTitle(`User information - **${requestedUser.username}**`)
				.setURL(`https://scratch.mit.edu/users/${user}`)
				.setThumbnail(`https://cdn2.scratch.mit.edu/get_image/user/${requestedUser.id}_90x90.png?v=`)
				.setDescription(`Find things about **${user}** on Scratch in this message.`)
				.addField("Username", requestedUser.username)
				.addField("ID", requestedUser.id)
				.addField("Scratch Team member?", scratchTeam)
				.addField("Joined on?", `A rejoint le ${monthDate} à ${hourDate}.`)
				.addField("Status", status)
				.addField("Bio", bio)
				.addField("Country", requestedUser.profile.country)
				.setTimestamp()
				.setFooter(client.user.username, client.user.avatarURL());
			message.channel.send(reponse);
		} else if (this.readyState === 4 && this.responseText === "{\"code\":\"NotFound\",\"message\":\"\"}") {
			message.reply("I did not find the user you requested.");
		}
	};
	xhttp.open("GET", `https://api.scratch.mit.edu/users/${user}`, true);
	xhttp.send();

	function checkLines(status: string) {
		let splittedArray: string[] = status.split("\n");
		for (let i: number = 0; i < splittedArray.length; i++) {
			if (splittedArray[i] != "") {
				return false;
			}
		}
		return true;
	}
}
