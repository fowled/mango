const DISCORD = require("discord.js");
const BOT = new DISCORD.Client();

// Commande relative aux membres/serveurs

exports.run = (BOT, message, args, options) => {

    const userInfo = message.mentions.users.first();
    if (userInfo) {
        const memberInfo = message.guild.member(userInfo);
        var userPresence = userInfo.presence.game;

        if (memberInfo) {
            var rolesSol = [];

            memberInfo.roles.forEach(role => rolesSol.push(role.name));

            rolesSol.shift();

            if (rolesSol.length == 0) {
                rolesSol = "Cet utilisateur ne possède aucun rôle.";
            } else {
                rolesSol = rolesSol.join(", ")
            }

            if (!userPresence) {
                userPresence = "Aucun jeu.";
            }

            reponse = new DISCORD.RichEmbed()
                .setTitle(`Informations à propos de l'utilisateur ${userInfo.username}`)
                .setAuthor(userInfo.username, userInfo.avatarURL)
                .setDescription("Retrouvez ici toutes les informations concernant votre compte Discord et ce serveur.")
                .setThumbnail(userInfo.avatarURL)
                .setTimestamp()
                .addField("Pseudonyme", userInfo.username, true)
                .addField("Tag", userInfo.discriminator, true)
                .addField("ID", userInfo.id, true)
                .addField("Statut", userInfo.presence.status, true)
                .addField("Statut de jeu", userPresence, true)
                .addField("Date d'arrivée dans le serveur", memberInfo.joinedAt.toLocaleString())
                .addField("Rôles dans le serveur", rolesSol)
                .addField("Date à laquelle le compte a été créé", userInfo.createdAt.toLocaleString())
                .setColor(Math.floor(Math.random() * 16777214) + 1)
                .setFooter(BOT.user.username, BOT.user.avatarURL)
            message.channel.send(reponse);
        } else {
            message.channel.send("L'utilisateur mentionné n'est pas dans le serveur ! :frowing:");
        }

    } else {
        var roles = [];
        var userPresence = message.author.presence.game;

        message.member.roles.forEach(role => roles.push(role.name));

        roles.shift();

        if (roles.length == 0) {
            roles = "Cet utilisateur ne possède aucun rôle.";
        } else {
            roles = roles.join(", ");
        }

        if (!userPresence) {
            userPresence = "Aucun jeu.";
        }

        reponse = new DISCORD.RichEmbed()
            .setTitle(`Informations à propos de l'utilisateur ${message.author.username}`)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription("Retrouvez ici toutes les informations concernant votre compte Discord et ce serveur.")
            .setThumbnail(message.author.avatarURL)
            .setTimestamp()
            .addField("Pseudonyme", message.author.username, true)
            .addField("Tag", message.author.discriminator, true)
            .addField("ID", message.author.id)
            .addField("Statut", message.member.presence.status, true)
            .addField("Statut de jeu", userPresence, true)
            .addField("Date d'arrivée dans le serveur", message.member.joinedAt.toLocaleString())
            .addField("Rôles dans le serveur", roles)
            .addField("Date à laquelle le compte a été créé", message.author.createdAt.toLocaleString())
            .setColor(Math.floor(Math.random() * 16777214) + 1)
            .setFooter(BOT.user.username, BOT.user.avatarURL)
        message.channel.send(reponse);
    }

}