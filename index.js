const DISCORD = require("discord.js");
const FS = require('file-system');
const BOT = new DISCORD.Client();
const TOKEN = require('./token.js');
const active = new Map();
const ownerID = '352158391038377984';
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const { post } = require("request");

var date = new Date;

BOT.login(TOKEN.token);

BOT.on('ready', () => {
    console.log('Le bot est prêt ! ' + date.toLocaleTimeString());
    BOT.user.setPresence({
        game: {
            name: '!infohelp for commands',
            type: "WATCHING",
        },
        status: 'online'
    });
});

BOT.on('guildCreate', guild => {
    const channel = guild.channels.find(ch => ch.name === 'bienvenue');
    if (!channel) return;
    richEmbedGC = new DISCORD.RichEmbed()
        .setAuthor(BOT.user.username, BOT.user.avatarURL)
        .setTitle(`Bonjour, je suis ${BOT.user.username}, et je suis nouveau dans ${guild.name} !`)
        .setDescription(`Les commandes d'aide ont été envoyées à ${guild.owner.user}, mais elles sont également disponibles à l'aide de la commande *!infohelp*.`)
        .setThumbnail(guild.iconURL)
        .setTimestamp()
        .setFooter(`${BOT.user.username} - Un bot multitâches crée par Mazz3015`, BOT.user.avatarURL)
        .setColor(Math.floor(Math.random() * 16777214) + 1)
    channel.send(richEmbedGC);

    repoRICH = new DISCORD.RichEmbed()
        .setAuthor(BOT.user.username, BOT.user.avatarURL)
        .setTitle(`Merci de m'avoir rajouté sur le serveur ${guild.name} !`)
        .setThumbnail(guild.iconURL)
        .setColor('#4782F9')
        .setDescription(`Retrouve les différentes commandes du bot crée par @Mazz3015#5853 avec *!infohelp* !`)
        .setTimestamp()
        .setFooter(`${BOT.user.username} - Un bot multitâches crée par Mazz3015.`, BOT.user.avatarURL)
    BOT.users.get(guild.owner.id).send(repoRICH);
});

BOT.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'bienvenue');
    if (!channel) return;

    reponse = new DISCORD.RichEmbed()
        .setTitle("Arrivée d'un membre sur le serveur :inbox_tray:")
        .setDescription(`Bienvenue, ${member} ! Nous te souhaitons une agréable expérience sur le serveur **${member.guild.name}**. Tu es le **${member.guild.memberCount}**e membre !`)
        .setTimestamp()
        .setColor('#83FF00')
        .setFooter(BOT.user.username, BOT.user.avatarURL)

    channel.send(reponse);

    reponse2 = new DISCORD.RichEmbed()
        .setTitle(`Bienvenue !`)
        .setDescription(`Bienvenue, ${member} ! Nous te souhaitons une agréable expérience sur le serveur **${member.guild.name}**.`)
        .setTimestamp()
        .setColor('#83FF00')
        .setFooter(BOT.user.username, BOT.user.avatarURL)
    BOT.users.get(member.id).send(reponse2);
});

BOT.on('guildMemberRemove', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'bienvenue');
    if (!channel) return;

    reponse = new DISCORD.RichEmbed()
        .setTitle("Départ d'un membre du serveur :outbox_tray:")
        .setDescription(`Au revoir, ${member.user.username}. Si quelqu'un sait pourquoi cette personne a quitté le serveur, merci de le dire à ${member.guild.owner} pour rendre le serveur meilleur.`)
        .setTimestamp()
        .setColor('#FF0000')
        .setFooter(BOT.user.username, BOT.user.avatarURL)

    channel.send(reponse);
});

BOT.on("error", error => {
    console.log(error, error.message, error.stack);
});

BOT.on('message', message => {
    checkXP(message.author.id);

    FS.readFile(`prefixes/${message.author.id}.txt`, (err, data) => {
        let prefix = `${data}`;

        if (err) {
            prefix = '!';
        }



        let msg = message.content.toUpperCase();
        let sender = message.author;
        let args = message.content.slice(prefix.length).trim().split(' ');
        let cmd = args.shift().toLowerCase();

        if (!msg.startsWith(prefix)) return;
        if (message.author.bot) return;
        if (!message.guild) return;

        try {

            let ops = {
                ownerID: ownerID,
                active: active
            }

            FS.readFile(`languages/${message.author.id}`, (err, data) => {
                if (err) {
                    FS.writeFile(`languages/${message.author.id}`, "En");
                } else {
                    let commandFile = require(`./commands/${data}/${cmd}.js`);
                    commandFile.run(BOT, message, args, ops);
                }

            });

        } catch (e) {
            console.log(e.message);
        } finally {
            console.log(`${message.author.tag} vient de faire marcher la commande ${cmd}.`);
        }

    });

    function checkXP(user) {
        if (message.author.bot) return;
        FS.readFile(`ranks/${user}.txt`, (err, data) => {
            if (err) {
                FS.writeFile(`ranks/${user}.txt`, 0);
            } else {
                let dataParsed = parseInt(data);
                FS.writeFile(`ranks/${user}.txt`, dataParsed += 1)

                if (data == 50 || data == 100 || data == 150 || data == 200 || data == 250 || data == 300 || data == 350 || data == 400 || data == 450 || data == 500 || data == 550 || data == 600 || data == 650 || data == 700 || data == 750 || data == 800 || data == 850 || data == 900 || data == 950 || data == 1000) {
                    let dataParsed = parseInt(data);
                    let level = dataParsed / 50;
                    level = level.toFixed();
                    return message.reply("Rank up! Vous êtes maintenant au level **" + level + "**.");

                }
            }
        });
    }
});