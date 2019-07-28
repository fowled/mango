const DISCORD = require("discord.js");

// Commande de modération

exports.run = (BOT, message, args, tools) => {
    const user = message.mentions.users.first();
    if (user) {
        const member = message.guild.member(user);
        var raison = message.content.split(" ");
        raison = raison.slice(2);
        raison = raison.join(" ");
        if (raison == "") {
            raison = "Pas de raison spécifiée";
        }
        if (member) {
            var authorMesskick = message.author.username;
            var serveurKick = message.member.guild.name;
            var serverIcon = message.member.guild.iconURL;
            var userBanID = user.id;
            var date = new Date;
            if (member.kickable && member.id != "352158391038377984") {
                reponse = new DISCORD.RichEmbed()
                    .setTitle(`Expulsion du serveur **${serveurKick}**, à la date __${date}__`)
                    .setDescription(`Vous avez été kick du serveur **${serveurKick}** par **${authorMesskick}** à la date __${date}__ ! Raison : *"${raison}"*`)
                    .setTimestamp()
                    .setThumbnail(serverIcon)
                    .setColor("#4292f4")
                    .setFooter(BOT.user.username, BOT.user.avatarURL)
                BOT.users.get(userBanID).send(reponse);
            }

            setTimeout(function () {
                member.kick(raison).then(() => {
                    reponse2 = new DISCORD.RichEmbed()
                        .setTitle(`Expulsion de l'utilisateur **${user.username}**`)
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription(`L'expulsion de l'utilisateur **${member.user.tag}** avec la raison *"${raison}"* a bien été effectué à : __${date}__ !`)
                        .setTimestamp()
                        .setThumbnail("https://vignette.wikia.nocookie.net/mysingingmonsters/images/6/6d/Ban-hammer-newB.jpg/revision/latest?cb=20170520125046")
                        .setColor("#4292f4")
                        .setFooter(BOT.user.username, BOT.user.avatarURL)
                    message.channel.send(reponse2);
                }).catch(err => {
                    reponse = new DISCORD.RichEmbed()
                        .setTitle(`:octagonal_sign: Erreur : expulsion de l'utilisateur **${member.user.username}**`)
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription(`Une erreur de permissions a eu lieu en expulsant l'utilisateur **${member.user.tag}** avec la raison *"${raison}"* : err_missing_permissions:couldn't_kick_user.`)
                        .setTimestamp()
                        .setThumbnail("")
                        .setColor("#FF0000")
                        .setFooter(BOT.user.username, BOT.user.avatarURL)
                    message.channel.send(reponse);
                    console.log(err);
                });
            }, 750);
        } else {
            message.reply("L'utilisateur mentionné n'est pas dans ce serveur ! Si vous recontrez cette erreur, merci d'en informer @Mazz3015#3015, avec le code 0x01.");
        }
    } else {
        reponse = new DISCORD.RichEmbed()
            .setTitle(`:octagonal_sign: Erreur !`)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription(`Vous n'avez pas mentionné de membre à expulser !`)
            .setTimestamp()
            .setThumbnail("")
            .setColor("#FF0000")
            .setFooter(BOT.user.username, BOT.user.avatarURL)
        message.channel.send(reponse);
    }
}