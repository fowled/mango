const DISCORD = require('discord.js');
const BOT = new DISCORD.Client();
const TOKEN = require('./token.js');

var date = new Date;

BOT.login(TOKEN.token);

function presence() {
    BOT.user.setPresence({
        status: 'online',
        game: {
            name: `!infohelp | Dans ${BOT.guilds.size} serveur(s) | ${BOT.users.size} utilisateurs`,
            type: 3
        }
    });
}

BOT.on('guildCreate', guild => {
    presence();
    const channel = guild.channels.find(ch => ch.name === 'bienvenue');
    if (!channel) return;
    richEmbedGC = new DISCORD.RichEmbed()
        .setAuthor(BOT.user.username, BOT.user.avatarURL)
        .setTitle(`Bonjour, je suis ${BOT.user.username}, et je suis nouveau dans ${guild.name} !`)
        .setDescription(`Les commandes d'aide ont été envoyées à ${guild.owner.user}, mais elles sont également disponibles à l'aide de la commande '!infohelp'.`)
        .setThumbnail(guild.iconURL)
        .setTimestamp()
        .setFooter("Informations'Bot - Un bot multitâches crée par Mazz3015#3015.", BOT.user.avatarURL)
        .setColor(Math.floor(Math.random() * 16777214) + 1)
    channel.send(richEmbedGC);

    repoRICH = new DISCORD.RichEmbed()
        .setAuthor(BOT.user.username, BOT.user.avatarURL)
        .setTitle(`Merci de m'avoir rajouté sur le serveur ${guild.name} !`)
        .setThumbnail(guild.iconURL)
        .setColor('#4782F9')
        .setDescription(`Retrouve les différentes commandes du bot crée par @Mazz3015#3015.`)
        .addField("• !ban @user raison", "Commande réservée aux administrateurs du serveur, permet de bannir un utilisateur rapidement et efficacement.")
        .addField("• !userinfo (@user)", "Permet d'avoir des informations sur l'utilisateur mentionné, ou des informations sur le créateur du message si aucune autre personne n'est mentionée.")
        .addField("• !servinfo", "Permet d'avoir des informations très précises et complètes sur le serveur actuel de l'auteur du message.")
        .setTimestamp()
        .setFooter("Informations'Bot - Un bot multitâches crée par Mazz3015#3015.", BOT.user.avatarURL)
    BOT.users.get(guild.owner.id).send(repoRICH);
});

BOT.on('guildDelete', () => {
    presence();
});

BOT.on('ready', () => {
    console.log('Le bot est prêt ! ' + date);
    presence();
});

BOT.on('guildMemberAdd', member => {
    presence();
    const channel = member.guild.channels.find(ch => ch.name === 'bienvenue');
    if (!channel) return;

    reponse = new DISCORD.RichEmbed()
        .setTitle("Arrivée d'un membre sur le serveur :inbox_tray:")
        .setDescription(`Bienvenue, ${member} ! Nous te souhaitons une agréable expérience sur le serveur ${member.guild.name}.`)
        .setTimestamp()
        .setColor('#83FF00')
        .setFooter("Informations'Bot", BOT.user.avatarURL)

    channel.send(reponse);
});

BOT.on('guildMemberRemove', member => {
    presence();
    const channel = member.guild.channels.find(ch => ch.name === 'bienvenue');
    if (!channel) return;

    reponse = new DISCORD.RichEmbed()
        .setTitle("Départ d'un membre du serveur :outbox_tray:")
        .setDescription(`Au revoir, ${member.user.username}. Si quelqu'un sait pourquoi cette personne a quitté le serveur, merci de le dire à ${member.guild.owner} pour rendre le serveur meilleur.`)
        .setTimestamp()
        .setColor('#FF0000')
        .setFooter("Informations'Bot", BOT.user.avatarURL)

    channel.send(reponse);
});


BOT.on('message', message => {
    if (!message.author.bot) {
        reponse = "";

        if (message.content.startsWith('!ban')) {

            var userlist = message.mentions.users;
            var usercount = 0;

            if (userlist != "") {
                userlist.forEach(function(user) {
                    usercount++;
                });

                var raison = message.content.split(" ");
                raison = raison.slice(usercount + 1);
                raison = raison.join(" ");

                if (raison == "") {
                    raison = "Pas de raison spécifiée";
                }

                userlist.forEach(function(user) {
                    const memberBan = message.guild.member(user);
                    const userBan = message.mentions.users.first();

                    if (memberBan) {
                        var authorMessBan = message.author.username;
                        var serveurBan = message.member.guild.name;
                        var serverIcon = message.member.guild.iconURL;
                        var userBanID = user.id;
                        var date = new Date;

                        if (memberBan.bannable && memberBan.id != "352158391038377984") {
                            reponse = new DISCORD.RichEmbed()
                                .setTitle(`Banissement du serveur ${serveurBan}, à la date ${date}`)
                                .setDescription(`Vous avez été banni du serveur ${serveurBan} par ${authorMessBan} à la date ${date} ! Raison : "${raison}"`)
                                .setTimestamp()
                                .setThumbnail(serverIcon)
                                .setColor("#4782F9")
                                .setFooter("Informations'Bot", BOT.user.avatarURL)
                            BOT.users.get(userBanID).send(reponse);
                        }

                        setTimeout(function() {
                            if (memberBan.id != "352158391038377984") {
                                memberBan.ban({
                                    reason: raison,
                                }).then(() => {
                                    reponse2 = new DISCORD.RichEmbed()
                                        .setTitle(`Banissement de l'utilisateur ${user.username}`)
                                        .setAuthor(message.author.username, message.author.avatarURL)
                                        .setDescription(`Le banissement de l'utilisateur ${memberBan} avec la raison "${raison}" a bien été effectué à : ${date} !`)
                                        .setTimestamp()
                                        .setThumbnail("https://vignette.wikia.nocookie.net/mysingingmonsters/images/6/6d/Ban-hammer-newB.jpg/revision/latest?cb=20170520125046")
                                        .setColor("#4782F9")
                                        .setFooter("Informations'Bot", BOT.user.avatarURL)
                                    message.channel.send(reponse2);

                                }).catch(err => {
                                    reponse = new DISCORD.RichEmbed()
                                        .setTitle(`:octagonal_sign: Erreur : banissement de l'utilisateur ${user.username}`)
                                        .setAuthor(message.author.username, message.author.avatarURL)
                                        .setDescription(`Une erreur de permissions a eu lieu en bannissant l'utilisateur ${memberBan} avec la raison "${raison}" : err_missing_permissions:couldn't_ban_user.`)
                                        .setTimestamp()
                                        .setThumbnail("")
                                        .setColor("#FF0000")
                                        .setFooter("Informations'Bot", BOT.user.avatarURL)
                                    message.channel.send(reponse);
                                    console.log(err);
                                });;
                            } else {
                                reponse = new DISCORD.RichEmbed()
                                .setTitle(`Hop là ! Au nom de la loi, j'arrête ${message.author.username}.`)
                                .setAuthor(message.author.username, message.author.avatarURL)
                                .setDescription(`On ne bannit pas le maître suprême, et le créateur du bot !`)
                                .setTimestamp()
                                .setThumbnail("")
                                .setColor("#FF0000")
                                .setFooter("Informations'Bot", BOT.user.avatarURL)
                            message.channel.send(reponse);
                            }
                        }, 1000);
                    } else {
                        message.reply('Une erreur est survenue : l\'utilisateur mentionné n\'est pas dans le serveur !');
                    }
                });
            } else {
                reponse = new DISCORD.RichEmbed()
                    .setTitle(`:octagonal_sign: Erreur : banissement de l'utilisateur ${user.username}`)
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setDescription(`Vous n'avez pas mentionné de membre(s) à bannir !`)
                    .setTimestamp()
                    .setThumbnail("")
                    .setColor("#FF0000")
                    .setFooter("Informations'Bot", BOT.user.avatarURL)
                message.channel.send(reponse);
            }
        }

        if (message.content.startsWith('!userinfo')) {
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
                        .setDescription("Retrouvez ici toutes les informations concernant votre compte Discord et ce serveur")
                        .setThumbnail(userInfo.avatarURL)
                        .setTimestamp()
                        .addField("Pseudonyme", userInfo.username, true)
                        .addField("Discriminateur", userInfo.discriminator, true)
                        .addField("ID", userInfo.id, true)
                        .addField("Statut", userInfo.presence.status, true)
                        .addField("Statut de jeu", userPresence, true)
                        .addField("Date d'arrivée dans le serveur", memberInfo.joinedAt.toLocaleString())
                        .addField("Rôles dans le serveur", rolesSol)
                        .addField("Date à laquelle le compte a été créé", userInfo.createdAt.toLocaleString())
                        .setColor(Math.floor(Math.random() * 16777214) + 1)
                        .setFooter("Informations'Bot", BOT.user.avatarURL)
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
                    roles.join(", ");
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
                    .addField("Discriminateur", message.author.discriminator, true)
                    .addField("ID", message.author.id)
                    .addField("Statut", message.member.presence.status, true)
                    .addField("Statut de jeu", userPresence, true)
                    .addField("Date d'arrivée dans le serveur", message.member.joinedAt.toLocaleString())
                    .addField("Rôles dans le serveur", roles)
                    .addField("Date à laquelle le compte a été créé", message.author.createdAt.toLocaleString())
                    .setColor(Math.floor(Math.random() * 16777214) + 1)
                    .setFooter("Informations'Bot", BOT.user.avatarURL)
                message.channel.send(reponse);
            }
        }

        if (message.content.startsWith('!servinfo')) {
            var verifiedOuiNon;
            var afkOuPas;
            var rolesSol = [];
            var emojis = [];
            var imageServer = message.member.guild.iconURL

            message.member.guild.roles.forEach(role => rolesSol.push(role.name));
            message.member.guild.emojis.forEach(emoji => emojis.push(emoji.name));

            rolesSol.shift();

            if (rolesSol.length == 0) {
                rolesSol = "Ce serveur ne possède aucun rôle (du moins, pour le moment).";
            } else {
                rolesSol.join(", ");
            }

            if (emojis == 0) {
                emojis = "Ce serveur ne possède aucun emoji.";
            } else {
                emojis.join(", ");
            }


            if (message.member.guild.verified) {
                verifiedOuiNon = "Oui, ce serveur est vérifié.";
            } else {
                verifiedOuiNon = 'Non, ce serveur n\'est pas vérifié.';
            }

            if (message.member.guild.afkChannel) {
                afkOuPas = message.member.guild.afkChannel;
            } else {
                afkOuPas = "Ce serveur ne comporte pas de channel pour afk !";
            }

            reponse = new DISCORD.RichEmbed()
                .setTitle(`Informations serveur pour ${message.author.username}`)
                .setThumbnail(imageServer)
                .setAuthor(`${message.author.username}`, message.author.avatarURL)
                .setDescription(`Informations à propos du serveur Discord ${message.member.guild.name} :`)
                .setColor('#4782F9')
                .addField('Nombre de membres', message.member.guild.memberCount)
                .addField('Tous les rôles du serveur', rolesSol)
                .addField('Propriétaire du serveur', message.member.guild.owner)
                .addField('Région du serveur', message.member.guild.region)
                .addField('Emojis du serveur', emojis)
                .addField('Niveau de vérification du serveur', message.member.guild.verificationLevel)
                .addField('Date à laquelle le serveur a été crée', message.member.guild.createdAt)
                .addField('Le serveur est-il vérifié ?', verifiedOuiNon)
                .addField('Le channel pour les afk', afkOuPas)
                .setFooter("Informations'Bot", BOT.user.avatarURL)
                .setTimestamp()
            message.channel.send(reponse);
        }

        if (message.content.startsWith('!infostats')) {

            if (BOT.user.verified) {
                verifiedOrNot = "Yup, je suis vérifié !";
            } else {
                verifiedOrNot = "Non, je ne suis pas vérifié :c";
            }

            reponse = new DISCORD.RichEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(`Statistiques sur le Bot Discord ${BOT.user.username}.`)
                .setTimestamp()
                .setThumbnail(BOT.user.avatarURL)
                .setColor('#4782F9')
                .addField('Nombre de serveurs dans lequel je suis présent', BOT.guilds.size)
                .addField(`Nombre d'utilisateurs total`, BOT.users.size)
                .addField('Statut', BOT.user.presence.status)
                .addField('Statut de jeu', BOT.user.presence.game)
                .addField('Suis-je un bot vérifié par Discord ?', verifiedOrNot)
                .setFooter("Informations'Bot", BOT.user.avatarURL)
            message.channel.send(reponse);
        }

        if (message.content.startsWith('!infohelp')) {
            reponse = new DISCORD.RichEmbed()
                .setTitle(`Aide sur le bot Discord Informations'Bot pour ${message.author.username}`)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setThumbnail(message.member.guild.iconURL)
                .setColor('#4782F9')
                .setDescription(`Retrouvez les différentes commandes du bot crée par @Mazz3015#3015`)
                .addField("• !ban @user raison", "Commande réservée aux administrateurs du serveur, permet de bannir un utilisateur rapidement et efficacement.")
                .addField("• !userinfo (@user)", "Permet d'avoir des informations sur l'utilisateur mentionné, ou des informations sur le créateur du message si aucune autre personne n'est mentionée.")
                .addField("• !servinfo", "Permet d'avoir des informations très précises et complètes sur le serveur actuel de l'auteur du message.")
                .setTimestamp()
                .setFooter("Informations'Bot", BOT.user.avatarURL)
            message.channel.send(reponse);
        }

    }
});