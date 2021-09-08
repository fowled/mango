import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest-ts";

// Scratch command

/**
 * Shows information about a Scratch user.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "scuserinfo",
	description: "Shows information about a Scratch user",
	category: "api",
	options: [
        {
            name: "user",
            type: "STRING",
            description: "The person's username",
            required: true
        },
	],

	execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
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
					.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
					.setColor("#FF8000")
					.setTitle(`User information - **${requestedUser.username}**`)
					.setURL(`https://scratch.mit.edu/users/${user}`)
					.setThumbnail(`https://cdn2.scratch.mit.edu/get_image/user/${requestedUser.id}_90x90.png?v=`)
					.setDescription(`Find things about **${user}** on Scratch in this interaction.`)
					.addField("Username", requestedUser.username)
					.addField("ID", requestedUser.id.toString())
					.addField("Scratch Team member?", requestedUser.scratchteam === true ? "yes" : "no")
					.addField("Joined timestamp", `Joined on ${monthDate} à ${hourDate}.`)
					.addField("Status", status)
					.addField("Bio", bio)
					.addField("Country", requestedUser.profile.country)
					.setTimestamp()
					.setFooter(Client.user.username, Client.user.avatarURL());
				interaction.reply({ embeds: [reponse] });
			} else if (this.readyState === 4 && this.responseText === "{\"code\":\"NotFound\",\"message\":\"\"}" || this.responseText.startsWith(`{"code":"ResourceNotFound"`)) {
				interaction.reply("I did not find the user you requested.");
			}
		};
		xhttp.open("GET", `https://api.scratch.mit.edu/users/${user}/`, true);
		xhttp.send();
	
		function checkLines(status: string) {
			const splitArray: string[] = status.split("\n");

			for (let i: number = 0; i < splitArray.length; i++) {
				if (splitArray[i] != "") {
					return false;
				}
			}
			return true;
		}
	}
}
