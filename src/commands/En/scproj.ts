import * as Discord from "discord.js";
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Scratch command

exports.run = async (client, message, args, ops) => {
    let project = args[0];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            let parsedRequest = JSON.parse(this.responseText);
            let sharedDate = this.responseText.split('"shared":"')[1].split(`T`)[0];
            let sharedHour = this.responseText.split(`"shared":"${sharedDate}T`)[1].split('.000Z"}')[0];

            const requestedProject = new DISCORD.RichEmbed()
                .setTitle(`Informations sur le projet ${parsedRequest.title}`)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setURL(`https://scratch.mit.edu/projects/${project}/`)
                .setThumbnail(message.author.avatarURL)
                .setImage(obj.image)
                .setDescription(`**${obj.title}** Information by **${parsedRequest.author.username}**.`)
                .addField("Number of :eye:", `**${parsedRequest.stats.views}** views.`)
                .addField("Number of :heart:", `**${parsedRequest.stats.loves}** loves.`)
                .addField("Number of :star:", `**${parsedRequest.stats.favorites}** stars.`)
                .addField("Number of :speech_balloon:", `**${parsedRequest.stats.comments}** comments.`)
                .addField("Number of :cyclone:", `**${parsedRequest.stats.remixes}** remixes.`)
                .addField("Sharing date", `Project shared on **${sharedDate}** at **${sharedHour}**.`)
                .setTimestamp()
                .setColor("#FF8000")
                .setFooter(client.user.username, client.user.avatarURL)
            message.channel.send(requestedProject);
        } else if (this.readyState == 4 && this.responseText == "{\"code\":\"NotFound\",\"message\":\"\"}") {
            message.reply("I did not find the project you requested.");
        }
    };
    xhttp.open("GET", `https://api.scratch.mit.edu/projects/${project}/`, true);
    xhttp.send();
}