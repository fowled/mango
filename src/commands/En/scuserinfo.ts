import * as Discord from "discord.js";
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Scratch command

export async function run(client: Discord.Client, message: Discord.Message, args: string[]) {
	const user = args[0];
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {

		if (this.readyState == 4 && this.status == 200) {
			const requestedUser = JSON.parse(xhttp.responseText);
			let scratchTeam;
			let status = requestedUser.profile.status;
			let bio = requestedUser.profile.bio;
			const monthDate = requestedUser.history.joined.split("T")[0];
			const hourDate = requestedUser.history.joined.split("T")[1].split(".000")[0];

			if (requestedUser.scratchteam == false) {
				scratchTeam = "No.";
			} else if (requestedUser.scratchteam == true) {
				scratchTeam = "Yep.";
			}

			if (requestedUser.profile.status == "") {
				status = "No status provided...";
			}

			if (requestedUser.profile.bio == "") {
				bio = "No bio provided...";
			}

			const reponse = new Discord.RichEmbed()
				.setAuthor(message.author.username, message.author.avatarURL)
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
				.setFooter(client.user.username, client.user.avatarURL)
			message.channel.send(reponse);

			// message.reply(`Username : **${username}** ; ID : **${idUser}** ; Membre de la ST : **${scratchTeam}** ; A rejoint le **${joinedDate}** à **${joinedHour}**`);
		} else if (this.readyState == 4 && this.responseText == "{\"code\":\"NotFound\",\"message\":\"\"}") {
			message.reply("I did not find the user you requested.");
		}
	};
	xhttp.open("GET", `https://api.scratch.mit.edu/users/${user}`, true);
	xhttp.send();
}
