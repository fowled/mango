const DISCORD = require("discord.js");
const BOT = new DISCORD.Client();

// Commande de modération

exports.run = (BOT, message, args, tools) => {
    var userlist = message.mentions.users;
    var usercount = 0;

    if (userlist.size != 0) {
        userlist.forEach(function (user) {
            usercount++;
        });

        var raison = message.content.split(" ");
        raison = raison.slice(usercount + 1);
        raison = raison.join(" ");

        if (raison == "") {
            raison = "Pas de raison spécifiée";
        }

        userlist.forEach(function (user) {
            const memberBan = message.guild.member(user);
            const userBan = message.mentions.users.first();

            if (memberBan) {
                var authorMessBan = message.author.tag;
                var serveurBan = message.member.guild.name;
                var serverIcon = message.member.guild.iconURL;
                var userBanID = user.id;
                var date = new Date;

                if (memberBan.bannable && memberBan.id != "352158391038377984") {
                    reponse = new DISCORD.RichEmbed()
                        .setTitle(`Banissement du serveur **${serveurBan}**, à la date __${date}__`)
                        .setDescription(`Vous avez été banni du serveur **${serveurBan}** par **${authorMessBan}** à la date __${date}__ ! Raison : *"${raison}"*`)
                        .setTimestamp()
                        .setThumbnail(serverIcon)
                        .setColor("#4292f4")
                        .setFooter(BOT.user.username, BOT.user.avatarURL)
                    BOT.users.get(userBanID).send(reponse);
                }

                setTimeout(function () {
                    if (memberBan.id != "352158391038377984") {
                        memberBan.ban({
                            reason: raison,
                        }).then(() => {
                            reponse2 = new DISCORD.RichEmbed()
                                .setTitle(`Banissement de l'utilisateur **${userBan.username}**`)
                                .setAuthor(message.author.username, message.author.avatarURL)
                                .setDescription(`Le banissement de l'utilisateur **${memberBan.user.tag}** avec la raison *"${raison}"* a bien été effectué à : __${date}__ !`)
                                .setTimestamp()
                                .setThumbnail("https://vignette.wikia.nocookie.net/mysingingmonsters/images/6/6d/Ban-hammer-newB.jpg/revision/latest?cb=20170520125046")
                                .setColor("#4292f4")
                                .setFooter(BOT.user.username, BOT.user.avatarURL)
                            message.channel.send(reponse2);

                        }).catch(err => {
                            reponse = new DISCORD.RichEmbed()
                                .setTitle(`:octagonal_sign: Erreur : banissement de l'utilisateur **${memberBan.user.username}**`)
                                .setAuthor(message.author.username, message.author.avatarURL)
                                .setDescription(`Une erreur de permissions a eu lieu en bannissant l'utilisateur **${memberBan.user.tag}** avec la raison *"${raison}"* : err_missing_permissions:couldn't_ban_user.`)
                                .setTimestamp()
                                .setThumbnail("")
                                .setColor("#FF0000")
                                .setFooter(BOT.user.username, BOT.user.avatarURL)
                            message.channel.send(reponse);
                            console.log(err);
                        });
                    } else {
                        reponse = new DISCORD.RichEmbed()
                            .setTitle(`Hop là ! Au nom de la loi, j'arrête **${message.author.username}**.`)
                            .setAuthor(message.author.username, message.author.avatarURL)
                            .setDescription(`On ne bannit pas le **maître suprême**, et le **créateur du bot** !`)
                            .setTimestamp()
                            .setThumbnail("")
                            .setColor("#FF0000")
                            .setFooter(BOT.user.username, BOT.user.avatarURL)
                        message.channel.send(reponse);
                    }
                }, 500);
            } else {
                message.reply('Une erreur est survenue : l\'utilisateur mentionné n\'est pas dans le serveur !');
            }
        });
    } else {
        reponse = new DISCORD.RichEmbed()
            .setTitle(`:octagonal_sign: Erreur !`)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription(`Vous n'avez pas mentionné de membre(s) à bannir !`)
            .setTimestamp()
            .setThumbnail("")
            .setColor("#FF0000")
            .setFooter(BOT.user.username, BOT.user.avatarURL)
        message.channel.send(reponse);
    }
}