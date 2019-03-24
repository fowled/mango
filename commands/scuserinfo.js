// Commande liée à Scratch

const DISCORD = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.run = async (client, message, args, ops) => {
    let user = args[0];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            obj = JSON.parse(xhttp.responseText);
            let scratchTeam;
            let status = obj.profile.status;
            let bio = obj.profile.bio;
            let dateMois = obj.history.joined.split("T")[0];
            let dateHeure = obj.history.joined.split("T")[1].split('.000')[0];

            if (obj.scratchteam == false) {
                scratchTeam = "Non.";
            } else if (obj.scratchteam == true) {
                scratchTeam = "Oui.";
            }

            if (obj.profile.status == "") {
                status = "Aucun statut indiqué.";
            }

            if (obj.profile.bio == "") {
                bio = "Aucune biographie indiquée.";
            }

            reponse = new DISCORD.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setColor("#FF8000")
                .setTitle(`Informations à propos de l'utilisateur **${obj.username}**`)
                .setURL(`https://scratch.mit.edu/users/${user}`)
                .setThumbnail(`https://cdn2.scratch.mit.edu/get_image/user/${obj.id}_90x90.png?v=`)
                .setDescription(`Retrouvez des informations sur l'utilisateur Scratch **${user}**.`)
                .addField("Nom d'utilisateur", obj.username)
                .addField("ID", obj.id)
                .addField("Est-ce un membre de l'Equipe Scratch ?", scratchTeam)
                .addField("Date d'arrivée sur Scratch", `A rejoint le ${dateMois} à ${dateHeure}.`)
                .addField("Statut", status)
                .addField("Biographie", bio)
                .addField("Pays", obj.profile.country)
                .setTimestamp()
                .setFooter(client.user.username, client.user.avatarURL)
            message.channel.send(reponse);

            //message.reply(`Username : **${username}** ; ID : **${idUser}** ; Membre de la ST : **${scratchTeam}** ; A rejoint le **${joinedDate}** à **${joinedHour}**`);
        } else if (this.readyState == 4 && this.responseText == "{\"code\":\"NotFound\",\"message\":\"\"}") {
            message.reply("Utilisateur non trouvé.");
        }
    };
    xhttp.open("GET", `https://api.scratch.mit.edu/users/${user}`, true);
    xhttp.send();
}