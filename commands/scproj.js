// Commande liée à Scratch

const DISCORD = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.run = async (client, message, args, ops) => {
    let project = args[0];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            let sharedDate = this.responseText.split('"shared":"')[1].split(`T`)[0];
            let sharedHour = this.responseText.split(`"shared":"${sharedDate}T`)[1].split('.000Z"}')[0];

            reponse = new DISCORD.RichEmbed()
                .setTitle(`Informations sur le projet ${obj.title}`)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setURL(`https://scratch.mit.edu/projects/${project}/`)
                .setThumbnail(message.author.avatarURL)
                .setImage(obj.image)
                .setDescription(`Retrouvez des informations sur le projet Scratch **${obj.title}** crée par **${obj.author.username}**.`)
                .addField("Nombre de :eye:", `**${obj.stats.views}** vues.`)
                .addField("Nombre de :heart:", `**${obj.stats.loves}** j'aime.`)
                .addField("Nombre de :star:", `**${obj.stats.favorites}** étoiles.`)
                .addField("Nombre de :speech_balloon:", `**${obj.stats.comments}** commentaires.`)
                .addField("Nombre de :cyclone:", `**${obj.stats.remixes}** remix.`)
                .addField("Date de partage", `Projet partagé le **${sharedDate}** à **${sharedHour}**.`)
                .setTimestamp()
                .setColor("#FF8000")
                .setFooter(client.user.username, client.user.avatarURL)
            message.channel.send(reponse);
        } else if (this.readyState == 4 && this.responseText == "{\"code\":\"NotFound\",\"message\":\"\"}") {
            message.reply("Il semblerait que le projet n'existe pas.");
        }
    };
    xhttp.open("GET", `https://api.scratch.mit.edu/projects/${project}/`, true);
    xhttp.send();
}