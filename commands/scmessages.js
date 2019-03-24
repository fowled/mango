// Commande liée à Scratch

const DISCORD = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.run = async (client, message, args, tools) => {
    let user = args[0];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            let object = JSON.parse(this.responseText);
            reponse = new DISCORD.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setColor("#FF8000")
                .setTitle("Informations messages Scratch (profil)")
                .setDescription(`Commande Scratch : nombre de messages de l'utilisateur **${user}**...`)
                .addField("Nombre de messages", `L'utilisateur **${user}** a actuellement **${object.count}** message(s).`)
                .setURL(`https://scratch.mit.edu/users/${user}`)
                .setThumbnail(message.author.avatarURL)
                .setTimestamp()
                .setFooter(client.user.username, client.user.avatarURL)
            message.channel.send(reponse);
        } else if (this.readyState == 4 && this.responseText == "{\"code\":\"NotFound\",\"message\":\"\"}") {
            message.reply("Utilisateur non trouvé");
        }
    };
    xhttp.open("GET", `https://api.scratch.mit.edu/users/${user}/messages/count`, true);
    xhttp.send();
}