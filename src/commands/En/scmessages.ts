import * as Discord from "discord.js";
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Scratch command

exports.run = async (client, message, args, tools) => {
    let user = args[0];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            let parsedRequest = JSON.parse(this.responseText);
            requestedMessages = new DISCORD.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setColor("#FF8000")
                .setTitle("Scratch messages information")
                .setDescription(`How many messages does **${user}** have?`)
                .addField("Number of messages", `**${user}** actually has **${parsedRequest.count}** message(s).`)
                .setURL(`https://scratch.mit.edu/users/${user}`)
                .setThumbnail(message.author.avatarURL)
                .setTimestamp()
                .setFooter(client.user.username, client.user.avatarURL)
            message.channel.send(requestedMessages);
        } else if (this.readyState == 4 && this.responseText == "{\"code\":\"NotFound\",\"message\":\"\"}") {
            message.reply("I did not find the user you requested.");
        }
    };
    xhttp.open("GET", `https://api.scratch.mit.edu/users/${user}/messages/count`, true);
    xhttp.send();
}