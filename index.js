const DISCORD = require("discord.js");
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

BOT.on('ready', () => {
    console.log('Le bot est prêt ! ' + date.toLocaleString());
    presence();
});

BOT.on('guildCreate', guild => {
    presence();
    const channel = guild.channels.find(ch => ch.name === 'bienvenue');
    if (!channel) return;
    richEmbedGC = new DISCORD.RichEmbed()
        .setAuthor(BOT.user.username, BOT.user.avatarURL)
        .setTitle(`Bonjour, je suis ${BOT.user.username}, et je suis nouveau dans ${guild.name} !`)
        .setDescription(`Les commandes d'aide ont été envoyées à ${guild.owner.user}, mais elles sont également disponibles à l'aide de la commande *!infohelp*.`)
        .setThumbnail(guild.iconURL)
        .setTimestamp()
        .setFooter(`${BOT.user.username} - Un bot multitâches crée par Mazz3015#3015.`, BOT.user.avatarURL)
        .setColor(Math.floor(Math.random() * 16777214) + 1)
    channel.send(richEmbedGC);

    repoRICH = new DISCORD.RichEmbed()
        .setAuthor(BOT.user.username, BOT.user.avatarURL)
        .setTitle(`Merci de m'avoir rajouté sur le serveur ${guild.name} !`)
        .setThumbnail(guild.iconURL)
        .setColor('#4782F9')
        .setDescription(`Retrouve les différentes commandes du bot crée par @Mazz3015#3015 avec *!infohelp* !`)
        .setTimestamp()
        .setFooter(`${BOT.user.username} - Un bot multitâches crée par Mazz3015#3015.`, BOT.user.avatarURL)
    BOT.users.get(guild.owner.id).send(repoRICH);
});

BOT.on('guildDelete', () => {
    presence();
});

BOT.on('guildMemberAdd', member => {
    presence();
    const channel = member.guild.channels.find(ch => ch.name === 'bienvenue');
    if (!channel) return;

    reponse = new DISCORD.RichEmbed()
        .setTitle("Arrivée d'un membre sur le serveur :inbox_tray:")
        .setDescription(`Bienvenue, ${member} ! Nous te souhaitons une agréable expérience sur le serveur **${member.guild.name}**. Tu es le **${member.guild.memberCount}**e membre !`)
        .setTimestamp()
        .setColor('#83FF00')
        .setFooter("Informations'Bot", BOT.user.avatarURL)

    channel.send(reponse);

    reponse2 = new DISCORD.RichEmbed()
        .setTitle(`Bienvenue !`)
        .setDescription(`Bienvenue, ${member} ! Nous te souhaitons une agréable expérience sur le serveur **${member.guild.name}**.`)
        .setTimestamp()
        .setColor('#83FF00')
        .setFooter("Informations'Bot", BOT.user.avatarURL)
    BOT.users.get(member.id).send(reponse2);
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

BOT.on("message", message => {
    if (!message.author.bot && message.guild) {
        reponse = "";

        // Commandes de modération :
        
        if (message.content.startsWith('!ban')) {

            var userlist = message.mentions.users;
            var usercount = 0;

            if (userlist.size != 0) {
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

                        setTimeout(function() {
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

        if (message.content.startsWith('!kick')) {
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
                    
                    setTimeout(function() {
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

        if (message.content.startsWith("!warn")) {
            var mentionnedUser = message.mentions.users.first();
            var member = message.guild.member(mentionnedUser);

            if (member && member.kickable) {
                var commande = message.content.split(" ");
                commande = commande.slice(2);
                commande = commande.join(" ");

                if (commande == "") {
                    commande = "Pas de raison spécifiée";
                }

                date = new Date;
                reponse = new DISCORD.RichEmbed()
                    .setTitle(`Warn pour l'utilisateur **${mentionnedUser.username}**`)
                    .setDescription(`L'utilisateur **${mentionnedUser.tag}** a reçu un *warn* de la part de **${message.author.tag}** à la date __${date.toLocaleString()}__ avec la raison *"${commande}"*.`)
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setThumbnail("https://images.discordapp.net/avatars/430546580114898945/ffece6ee4a939121d311051082fbf3fa.png?size=512")
                    .setFooter(BOT.user.username, BOT.user.avatarURL)
                    .setColor("#4292f4")
                    .setTimestamp()
                message.channel.send(reponse);

                reponse2 = new DISCORD.RichEmbed()
                    .setTitle(`Warn pour l'utilisateur **${mentionnedUser.username}**`)
                    .setDescription(`Vous avez reçu un *warn* de la part de **${message.author.username}** à la date __${date.toLocaleString()}__ avec la raison *"${commande}"*.`)
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setThumbnail("https://images.discordapp.net/avatars/430546580114898945/ffece6ee4a939121d311051082fbf3fa.png?size=512")
                    .setFooter(BOT.user.username, BOT.user.avatarURL)
                    .setColor("#4292f4")
                    .setTimestamp()
                BOT.users.get(mentionnedUser.id).send(reponse2).catch(U_U => {
                message.channel.send(`Information : l'utilisateur **${mentionnedUser.tag}** n'accepte pas les dm venant de serveurs, et le message warn n'a pas pu être envoyé.`);
            });
        } else {
            message.reply("Vous n'avez pas les droits d'avertir cet utilisateur !");
        }
        }

        if (message.content.startsWith("!clear")) {
            var commande = message.content.split(" ");
            commande = commande.slice(1);
            if (isNaN(commande[0])) {
                message.reply("Merci d'entrer un nombre de messages à supprimer !");
            } else if (commande[0] <= 100) {
                message.channel.bulkDelete(commande[0]);
            } else {
                message.reply("Le nombre de messages à supprimer étant trop grand, je n'en supprimerai que 100.")
                setTimeout(function() {
                    message.channel.bulkDelete(100);
                }, 2000);
            }
        }

        if (message.content.startsWith("!pin")) {
            var commande = message.content.split(" ");
            commande = commande.slice(1);
            message.channel.lastMessage.pin().then(message.reply("Le dernier message du channel a successivement été épinglé.").then(msg => msg.delete(1000)));
        }

        if (message.content.startsWith("!createrole")) {
            var commande = message.content.split(" ");
            commande = commande.slice(1);
            message.guild.createRole({
                name: commande[0]
            });
            message.reply(`Le rôle **${commande}** a bien été crée !`);
        }

        if (message.content.startsWith("!delrole")) {
            var commande = message.content.split(" ");
            commande = commande.slice(1);
            var rolesuppr = message.guild.roles.find(role => role.name === commande[0]);
            if (rolesuppr != null) {
                rolesuppr.delete();
            } else if (rolesuppr == null) {
                message.reply("Uh oh, il semblerait que le rôle à supprimer n'existe pas. Veuillez vérifier son orthographe.");
            }
            
        }

        // Commandes relatives aux membres/au serveur :

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

        if (message.content.startsWith('!servinfo')) {
            var verifiedOuiNon;
            var afkOuPas;
            var rolesSol = [];
            var emojis = [];
            var imageServer = message.member.guild.iconURL;

            message.member.guild.roles.forEach(role => rolesSol.push(role.name));
            message.member.guild.emojis.forEach(emoji => emojis.push(emoji.name));

            rolesSol.shift();

            if (rolesSol.length == 0) {
                rolesSol = "Ce serveur ne possède aucun rôle (du moins, pour le moment).";
            } else {
                rolesSol = rolesSol.join(", ");
            }

            if (emojis == 0) {
                emojis = "Ce serveur ne possède aucun emoji.";
            } else {
                emojis = emojis.join(", ");
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
                .setColor(Math.floor(Math.random() * 16777214) + 1)
                .addField('Nombre d\'humains | Nombre de bots | Nombre de membres total', `${message.member.guild.members.filter(member => !member.user.bot).size} humains | ${message.member.guild.members.filter(member => member.user.bot).size} bots | ${message.member.guild.memberCount} membres`)
                .addField("Nombre de channels textuels | Nombre de channels vocaux | Nombre de channels & catégories total", `${message.member.guild.channels.filter(channel => channel.type == "text").size} channels textuels | ${message.member.guild.channels.filter(channel => channel.type == "voice").size} channels vocaux | Total de ${message.guild.channels.size} channels & catégories`)
                .addField('Tous les rôles du serveur', rolesSol)
                .addField('Propriétaire du serveur', message.member.guild.owner)
                .addField('Région du serveur', message.member.guild.region)
                .addField('Emojis du serveur', emojis)
                .addField('Niveau de vérification du serveur', message.member.guild.verificationLevel)
                .addField('Date à laquelle le serveur a été crée', message.member.guild.createdAt.toLocaleString())
                .addField('Le serveur est-il vérifié ?', verifiedOuiNon)
                .addField('Le channel pour les afk', afkOuPas)
                .setFooter(BOT.user.username, BOT.user.avatarURL)
                .setTimestamp()
            message.channel.send(reponse);
        }

        if (message.content.startsWith("!invite")) {
            message.guild.channels.get(message.channel.id).createInvite().then(invite =>
                message.channel.send(invite.url).catch(message.reply("Il semblerait que je n'ai pas le droit de créer une invitation..."))
            );
        }

        // Commandes d'amusement :

        if (message.content.startsWith("!dire")) {
            var commande = message.content.split(" ");
            commande = commande.slice(1, commande.length-2);
            var mentionnedUser = message.mentions.users.first();
            var date = new Date;
            if (mentionnedUser) {
            message.channel.send("Le message va s'envoyer.");
            BOT.users.get(mentionnedUser.id).send(`*${message.author.username} vous a envoyé, à ${date.toLocaleString()}* : ${commande.join(" ")}`)
            .catch(err => {
                message.reply("L'utilisateur bloque ses messages.");
            });
        } else {
            message.reply("Merci de mentionner un utilisateur valide, et présent sur le serveur.");
        }
        }

        if (message.content.includes("heure")) {
            var date = new Date;
            message.reply(`Nous sommes le **${date.toLocaleDateString()}** et il est *${date.toLocaleTimeString()}* !`)
        }

        if (message.content.startsWith("!easter egg")) {
            var random_pictures = [
                
            ]
            message.channel.send( {
                file: random_pictures[Math.floor(Math.random() * random_pictures.length)]
            });
        }

        // Commandes liées au bot :

        if (message.content.startsWith("!sug") && message.guild.id === "422126977747648515") {
            date = new Date;
            var content = message.content.split(" ");
            content = content.slice(1);
            content = content.join(" ");
            reponse = new DISCORD.RichEmbed()
                .setTitle(`Nouvelle suggestion, proposée par **${message.author.username}** !`)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
                .setDescription(`Une proposition pour le bot **${BOT.user.username}** vient d'être faite par **${message.author.username}** le __${date.toLocaleString()}__ :grinning:`)
                .addField("Suggestion", `${content}`)
                .setColor("FF9F8B")
                .setThumbnail("https://pbs.twimg.com/profile_images/963073528663814145/F47WvJlR_400x400.jpg")
                .setFooter(BOT.user.username, BOT.user.avatarURL)
            var chan = message.guild.channels.find(channel => channel.name === "suggestions-all-bots");
            BOT.channels.get(chan.id).send(reponse);
        } else if (message.content.startsWith("!sug") || !message.guild.id === "422126977747648515") {
            message.reply(`Envie de soumettre des suggestions pour le bot ${BOT.user.username} ? Envoyez un dm à @Mazz3015#3015 ou bien rejoignez ce serveur ! https://discord.gg/QEKhPj`);
        }

        if (message.content.startsWith("!bug")) {
            date = new Date;
            var content = message.content.split(" ");
            content = content.slice(1);
            content = content.join(" ");
            message.reply("Le bug a bien été reporté à Mazz3015 !");
            BOT.users.get("352158391038377984").send(`Un nouveau bug a été reporté par **${message.author.username, message.author.tag}** dans le serveur *${message.member.guild.name}*, le __${date.toLocaleString()}__ : "*${content}*"`);
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
                .setColor("FF9F8B")
                .addField('Nombre de serveurs dans lequel je suis présent', BOT.guilds.size)
                .addField(`Nombre d'utilisateurs total`, BOT.users.size)
                .addField('Statut', BOT.user.presence.status)
                .addField('Statut de jeu', BOT.user.presence.game)
                .addField('Suis-je un bot vérifié par Discord ?', verifiedOrNot)
                .setFooter(BOT.user.username, BOT.user.avatarURL)
            message.channel.send(reponse);
        }

        if (message.content.startsWith("!invbot")) {
            message.reply("Tu veux m'inviter ? Merci ! Clique sur ce lien ! https://discordapp.com/api/oauth2/authorize?client_id=497443144632238090&permissions=8&scope=bot");
        }

        if (message.content.startsWith("!infoping")) {
            reponse = new DISCORD.RichEmbed()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription("L'API Discord n'est parfois pas très stable, retrouvez quel est son ping ici.")
            .addField("Ping de l'API Discord :", `**${Math.round(BOT.ping)}** ms.`)
            .setFooter(BOT.user.username, BOT.user.avatarURL)
            .setTimestamp()
            .setColor("FF9F8B")
            message.channel.send(reponse);
        }

        if (message.content.startsWith("!uptime")) {
            let totalSeconds = (BOT.uptime / 1000);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;

            if (hours == "0" && minutes != "0") {
                message.reply(`Uptime: ${Math.round(minutes)} minutes et ${Math.round(seconds)} secondes.`);
            } else if (hours == "0" && minutes == "0") {
                message.reply(`Uptime: ${Math.round(seconds)} secondes.`);
            } else if (hours != "0" && minutes != "0") {
                message.reply(`Uptime: ${Math.round(hours)} heures, ${Math.round(minutes)} minutes et ${Math.round(seconds)} secondes.`);
            }
        }

        if (message.content.startsWith('!infohelp')) {
            reponse = new DISCORD.RichEmbed()
                .setTitle(`Aide: bot Discord ${BOT.user.username} pour ${message.author.username}`)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setThumbnail(message.member.guild.iconURL)
                .setColor("#4292f4")
                .setDescription(`Aide pour les commandes de modération.`)
                .addField("• *!ban [user] (raison)*", "Commande réservée aux administrateurs du serveur, permet de bannir un utilisateur rapidement et efficacement.")
                .addField("• *!kick [user] (raison)*", `C'est la même chose que le ban, mais un degré moins fort. Plus besoin d'appeller **${message.guild.owner.user.tag}** pour unban tout le monde maintenant !`)
                .addField("• *!warn [user] [raison]*", "Les bons modos l'utilisent. :grinning:")
                .addField("• *!clear [nombre message < 100]*", "Supprime 100 messages d'un coup !")
                .addField("• *!createrole [nom rôle]*", "Pour les (gros) flemmards qui n'ont pas la patience de créer un rôle en utilisant leur souris.")
                .addField("• *!delrole [nom rôle]*", "Même chose, mais pour supprimer un rôle.")
                .setTimestamp()
                .setFooter(BOT.user.username, BOT.user.avatarURL)
            message.channel.send(reponse);

            reponse2 = new DISCORD.RichEmbed()
                .setTitle(`Aide: bot Discord ${BOT.user.username} pour ${message.author.username}`)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setThumbnail(message.member.guild.iconURL)
                .setColor(Math.floor(Math.random() * 16777214) + 1)
                .setDescription(`Aide pour les commandes relatives aux membres/au serveur.`)
                .addField("• *!userinfo (user)*", "Envoie des infos bien pratiques sur votre/le compte mentionné.")
                .addField("• *!servinfo*", "Informations sur le serveur, rien de plus classique...")
                .addField("• *!invite*", "Le bot vous envoie un lien d'invitation pour le serveur dans lequel vous avez envoyé le message.")
                .setTimestamp()
                .setFooter(BOT.user.username, BOT.user.avatarURL)
            message.channel.send(reponse2);

            reponse3 = new DISCORD.RichEmbed()
                .setTitle(`Aide: bot Discord ${BOT.user.username} pour ${message.author.username}`)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setThumbnail(message.member.guild.iconURL)
                .setDescription(`Aide pour les commandes d'amusement.`)
                .addField("• *heure*", 'Incluez le mot "heure" dans un message sur Discord, vous verrez, c\'est drôle !')
                .addField("• *!easter egg*", "Découvrez des petites surprises rencontrées par le créateur du bot durant son développement !")
                .addField("• *!dire [phrase] à [user]*", `Un utilisateur vous a bloqué parce que vous le spammiez trop ? Aucun problème, ${BOT.user.username} est là ! :wink:`)
                .setTimestamp()
                .setFooter(BOT.user.username, BOT.user.avatarURL)
            message.channel.send(reponse3);

            reponse4 = new DISCORD.RichEmbed()
                .setTitle(`Aide: bot Discord ${BOT.user.username} pour ${message.author.username}`)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setThumbnail(message.member.guild.iconURL)
                .setColor("FF9F8B")
                .setDescription(`Aide pour les commandes liées au bot.`)
                .addField("• *!sug [suggestion]*", 'Faites une suggestion pour le bot !')
                .addField("• *!bug [bug]*", "Un dm sera automatiquement envoyé quand un bug sera reporté. Dang dang, ça rime.")
                .addField("• *!infoping*", `Elle donne le ping de l'API Discord. Il peut varier en fonction de la région du serveur, indiquée dans les paramtères.`)
                .addField("• *!infostats*", "Pour avoir des infos en temps réel sur ce bot !")
                .addField("• *!invbot*", "Permet d'inviter ce bot dans d'autres serveurs ! Merci !")
                .addField("• *!uptime*", "L'uptime du bot, c'est à dire depuis combien de temps il est lancé. Pas longtemps en général, aaaah les raspberry pi...")
                .setTimestamp()
                .setFooter(BOT.user.username, BOT.user.avatarURL)
            message.channel.send(reponse4);
        }

    } else if (!message.guild && message.content.startsWith("!")) {
        message.reply("Les fonctions de ce bot ne sont pas disponibles en MP. Désolé !");
    }
});
