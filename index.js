const DISCORD = require("discord.js");
const FS = require('file-system');
const BOT = new DISCORD.Client();
const TOKEN = require('./token.js');
const active = new Map();
const ownerID = '352158391038377984';

var date = new Date;

BOT.login(TOKEN.token);

BOT.on('ready', () => {
    console.log('Bot is ready - ' + date.toLocaleTimeString());
    BOT.user.setPresence({
        game: {
            name: '!infohelp for commands',
            type: "WATCHING",
        },
        status: 'online'
    });
});

BOT.on('guildCreate', guild => {
    const channel = guild.channels.find(ch => ch.name === 'welcome');
    if (!channel) return;
    richEmbedServer = new DISCORD.RichEmbed()
        .setAuthor(BOT.user.username, BOT.user.avatarURL)
        .setTitle(`Hi, I'm ${BOT.user.username} and I'm pretty new in ${guild.name}!`)
        .setDescription(`Help message has been sent to ${guild.owner.user}, but they are also available typing *!infohelp*.`)
        .setThumbnail(guild.iconURL)
        .setTimestamp()
        .setFooter(`${BOT.user.username} - A multitask and multilingual bot`, BOT.user.avatarURL)
        .setColor(Math.floor(Math.random() * 16777214) + 1)
    channel.send(richEmbedServer);

    richEmbedOwner = new DISCORD.RichEmbed()
        .setAuthor(BOT.user.username, BOT.user.avatarURL)
        .setTitle(`Thank you for adding me in ${guild.name}!`)
        .setThumbnail(guild.iconURL)
        .setColor('#4782F9')
        .setDescription(`Help message: *!infohelp*.`)
        .setTimestamp()
        .setFooter(`${BOT.user.username} - A multitask and multilingual bot`, BOT.user.avatarURL)
    BOT.users.get(guild.owner.id).send(richEmbedServer);
});

BOT.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'welcome');
    if (!channel) return;

    richEmbedWelcomeServer = new DISCORD.RichEmbed()
        .setTitle("A member just arrived :inbox_tray:")
        .setDescription(`Welcome ${member}! We wish you to have fun in **${member.guild.name}**. Guild has now **${member.guild.memberCount}** members!`)
        .setTimestamp()
        .setColor('#83FF00')
        .setFooter(BOT.user.username, BOT.user.avatarURL)

    channel.send(richEmbedWelcomeServer);

    richEmbedWelcomeMember = new DISCORD.RichEmbed()
        .setTitle(`Welcome!`)
        .setDescription(`Welcome ${member}! We wish you to have fun in **${member.guild.name}**. Help message: type *!infohelp* in server!`)
        .setTimestamp()
        .setColor('#83FF00')
        .setFooter(BOT.user.username, BOT.user.avatarURL)
    BOT.users.get(member.id).send(richEmbedWelcomeMember);
});

BOT.on('guildMemberRemove', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'welcome');
    if (!channel) return;

    richEmbedGoodbye = new DISCORD.RichEmbed()
        .setTitle("A member just left :outbox_tray:")
        .setDescription(`Goodbye ${member.user.username}. We hope you'll come back :confused:`)
        .setTimestamp()
        .setColor('#FF0000')
        .setFooter(BOT.user.username, BOT.user.avatarURL)

    channel.send(richEmbedGoodbye);
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
            console.log(`${message.author.tag} just used ${cmd}.`);
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
                    return message.reply("Rank up! You are now level **" + level + "**.");

                }
            }
        });
    }
});