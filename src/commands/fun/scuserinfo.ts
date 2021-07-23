import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest-ts";

// Scratch command

/**
 * Shows information about a Scratch user.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "scuserinfo",
	description: "Shows information about a Scratch user",
	category: "fun",
	options: [
        {
            name: "user",
            type: "STRING",
            description: "The person's username",
            required: true
        },
	],

	execute(Client: Discord.Client, message: Discord.Message, args, ops) {
		const user: string = args[0];
		const xhttp: any = new XMLHttpRequest();
	
		xhttp.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				const requestedUser = JSON.parse(xhttp.responseText);
				let status: any = requestedUser.profile.status;
				let bio: any = requestedUser.profile.bio;
				const monthDate: any = requestedUser.history.joined.split("T")[0];
				const hourDate: any = requestedUser.history.joined.split("T")[1].split(".000")[0];
	
				if (requestedUser.profile.status === "" || checkLines(requestedUser.profile.status.toString())) {
					status = "No status provided...";
				}
	
				if (requestedUser.profile.bio === "" || checkLines(requestedUser.profile.bio.toString())) {
					bio = "No bio provided...";
				}
	
				const reponse: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setAuthor(message.member.user.username, message.member.user.avatarURL())
					.setColor("#FF8000")
					.setTitle(`User information - **${requestedUser.username}**`)
					.setURL(`https://scratch.mit.edu/users/${user}`)
					.setThumbnail(`https://cdn2.scratch.mit.edu/get_image/user/${requestedUser.id}_90x90.png?v=`)
					.setDescription(`Find things about **${user}** on Scratch in this message.`)
					.addField("Username", requestedUser.username)
					.addField("ID", requestedUser.id.toString())
					.addField("Scratch Team member?", requestedUser.scratchteam === true ? "yes" : "no")
					.addField("Joined timestamp", `Joined on ${monthDate} à ${hourDate}.`)
					.addField("Status", status)
					.addField("Bio", bio)
					.addField("Country", requestedUser.profile.country)
					.setTimestamp()
					.setFooter(Client.user.username, Client.user.avatarURL());
				message.reply({ embeds: [reponse] });
			} else if (this.readyState === 4 && this.responseText === "{\"code\":\"NotFound\",\"message\":\"\"}" || this.responseText.startsWith(`{"code":"ResourceNotFound"`)) {
				message.reply("I did not find the user you requested.");
			}
		};
		xhttp.open("GET", `https://api.scratch.mit.edu/users/${user}/`, true);
		xhttp.send();
	
		function checkLines(status: string) {
			let splitArray: string[] = status.split("\n");
			for (let i: number = 0; i < splitArray.length; i++) {
				if (splitArray[i] != "") {
					return false;
				}
			}
			return true;
		}
	}
}
