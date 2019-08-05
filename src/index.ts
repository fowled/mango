import * as Discord from "discord.js";
import * as FS from "fs";

import TOKEN from "./token.js";

const Bot: Discord.Client = new Discord.Client();
const active: Map<number, boolean> = new Map();
const ownerID: string = '352158391038377984';

var date: Date = new Date;

Bot.login(TOKEN.token);

Bot.on('ready', (): void => {
    process.stdout.write('Bot is ready - ' + date.toLocaleTimeString() + "\n");
    Bot.user.setPresence({
        game: {
            name: '!infohelp for commands',
            type: "WATCHING",
        },
        status: 'online'
    });
});

Bot.on('guildCreate', (guild: Discord.Guild): void => {
    const channel: Discord.TextChannel = guild.channels.find(ch => ch.name === 'welcome') as Discord.TextChannel;
    if (!channel) return;

    var richEmbedServer: Discord.RichEmbed = new Discord.RichEmbed()
        .setAuthor(Bot.user.username, Bot.user.avatarURL)
        .setTitle(`Hi, I'm ${Bot.user.username} and I'm pretty new in ${guild.name}!`)
        .setDescription(`Help message has been sent to ${guild.owner.user}, but they are also available typing *!infohelp*.`)
        .setThumbnail(guild.iconURL)
        .setTimestamp()
        .setFooter(`${Bot.user.username} - A multitask and multilingual bot`, Bot.user.avatarURL)
        .setColor(Math.floor(Math.random() * 16777214) + 1);
    channel.send(richEmbedServer);

    var richEmbedOwner: Discord.RichEmbed = new Discord.RichEmbed()
        .setAuthor(Bot.user.username, Bot.user.avatarURL)
        .setTitle(`Thank you for adding me in ${guild.name}!`)
        .setThumbnail(guild.iconURL)
        .setColor('#4782F9')
        .setDescription(`Help message: *!infohelp*.`)
        .setTimestamp()
        .setFooter(`${Bot.user.username} - A multitask and multilingual bot`, Bot.user.avatarURL)
    Bot.users.get(guild.owner.id).send(richEmbedOwner);
});

Bot.on('guildMemberAdd', (member: Discord.GuildMember): void => {
    const channel: Discord.TextChannel = member.guild.channels.find(ch => ch.name === 'welcome') as Discord.TextChannel;
    if (!channel) return;

    var richEmbedWelcomeServer: Discord.RichEmbed = new Discord.RichEmbed()
        .setTitle("A member just arrived :inbox_tray:")
        .setDescription(`Welcome ${member}! We wish you to have fun in **${member.guild.name}**. Guild has now **${member.guild.memberCount}** members!`)
        .setTimestamp()
        .setColor('#83FF00')
        .setFooter(Bot.user.username, Bot.user.avatarURL)
    channel.send(richEmbedWelcomeServer);

    var richEmbedWelcomeMember: Discord.RichEmbed = new Discord.RichEmbed()
        .setTitle(`Welcome!`)
        .setDescription(`Welcome ${member}! We wish you to have fun in **${member.guild.name}**. Help message: type *!infohelp* in server!`)
        .setTimestamp()
        .setColor('#83FF00')
        .setFooter(Bot.user.username, Bot.user.avatarURL)
    Bot.users.get(member.id).send(richEmbedWelcomeMember);
});

Bot.on('guildMemberRemove', (member: Discord.GuildMember) => {
    const channel: Discord.TextChannel = member.guild.channels.find(ch => ch.name === 'welcome') as Discord.TextChannel;
    if (!channel) return;

    var richEmbedGoodbye: Discord.RichEmbed = new Discord.RichEmbed()
        .setTitle("A member just left :outbox_tray:")
        .setDescription(`Goodbye ${member.user.username}. We hope you'll come back :confused:`)
        .setTimestamp()
        .setColor('#FF0000')
        .setFooter(Bot.user.username, Bot.user.avatarURL)

    channel.send(richEmbedGoodbye);
});

Bot.on("error", (error: Error) => {
    process.stdout.write(`${error}\n${error.message}\n${error.stack}\n`);
});

Bot.on('message', (message: Discord.Message) => {

    checkXP(message.author.id);

    FS.readFile(`prefixes/${message.author.id}.txt`, (err: Error, data) => {
        let prefix: string;

        if (err) {
            prefix = '!';
        } else {
            prefix = data.toString();
        }

        let msg: string = message.content.toUpperCase();
        let sender: Discord.User = message.author;
        let args: string[] = message.content.slice(prefix.length).trim().split(' ');
        let cmd: string = args.shift().toLowerCase();

        if (!msg.startsWith(prefix)) return;
        if (message.author.bot) return; // peut-être mieux de vérifier ça en premier
        if (!message.guild) return;

        try {

            let ops = {
                ownerID: ownerID,
                active: active
            }

            FS.readFile(`languages/${message.author.id}`, (err, data) => {
                if (err) {
                    FS.writeFileSync(`languages/${message.author.id}`, "En");
                    let commandFile = require(`./commands/${data}/${cmd}.js`);
                    commandFile.run(Bot, message, args, ops);
                } else {
                    let commandFile = require(`./commands/${data}/${cmd}.js`);
                    commandFile.run(Bot, message, args, ops);
                }

            });

        } catch (e) {
            process.stdout.write(e.message + "\n");
        } finally {
            process.stdout.write(`${message.author.tag} just used the ${cmd} power.\n`);
        }

    });

    /**
     * Vérifie l'xp de l'utilisateur
     * 
     * @param {string} userId le numéro de l'utilisateur (en string) à vérifier
     */
    
    function checkXP(userId: string): void {
        if (message.author.bot) return; // pas moyen de vérifier si l'utilisateur est un bot juste avec son id...

        let userXp: number;
        try {
            userXp = Number.parseInt(FS.readFileSync(`ranks/${userId}.txt`).toString(), 10);

            userXp++;

            FS.writeFileSync(`ranks/${userId}.txt`, userXp);

            if (userXp % 50 === 0 && userXp >= 50 && userXp <= 1000) {
                message.reply("Rank up! You are now level **" + Math.ceil(userXp / 50) + "**."); // message est pas accessible
            }

        } catch(e) {
            FS.writeFileSync(`ranks/${userId}.txt`, 0);
        }
    }
});
