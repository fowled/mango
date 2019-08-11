import * as Discord from "discord.js";
import * as FS from "fs";

import * as Logger from "./utils/Logger";
import TOKEN from "./token";

const Bot: Discord.Client = new Discord.Client();
const active: Map<number, boolean> = new Map();
const ownerID: string = "352158391038377984";

Bot.login(TOKEN.token);

Bot.on("ready", (): void => {
    Logger.log("Bot is ready");
    Bot.user.setPresence({
        game: {
            name: "!infohelp for commands",
            type: "WATCHING",
        },
        status: "online"
    });
});

Bot.on("guildCreate", (guild: Discord.Guild): void => {
    const channel: Discord.TextChannel = guild.channels.find(ch => ch.name === "welcome") as Discord.TextChannel;
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
        .setColor("#4782F9")
        .setDescription(`Help message: *!infohelp*.`)
        .setTimestamp()
        .setFooter(`${Bot.user.username} - A multitask and multilingual bot`, Bot.user.avatarURL);
    Bot.users.get(guild.owner.id).send(richEmbedOwner);
});

Bot.on("guildMemberAdd", (member: Discord.GuildMember): void => {
    try {
        FS.accessSync(`/ranks/${member.id}`, FS.constants.R_OK | FS.constants.W_OK);
    } catch (e) {
        FS.writeFileSync(`/ranks/${member.id}`, "0");
    }

    const channel: Discord.TextChannel = member.guild.channels.find(ch => ch.name === "welcome") as Discord.TextChannel;
    if (!channel) return;

    var richEmbedWelcomeServer: Discord.RichEmbed = new Discord.RichEmbed()
        .setTitle("A member just arrived :inbox_tray:")
        .setDescription(`Welcome ${member}! We wish you to have fun in **${member.guild.name}**. Guild has now **${member.guild.memberCount}** members!`)
        .setTimestamp()
        .setColor("#83FF00")
        .setFooter(Bot.user.username, Bot.user.avatarURL);
    channel.send(richEmbedWelcomeServer);

    var richEmbedWelcomeMember: Discord.RichEmbed = new Discord.RichEmbed()
        .setTitle(`Welcome!`)
        .setDescription(`Welcome ${member}! We wish you to have fun in **${member.guild.name}**. Help message: type *!infohelp* in server!`)
        .setTimestamp()
        .setColor("#83FF00")
        .setFooter(Bot.user.username, Bot.user.avatarURL);
    Bot.users.get(member.id).send(richEmbedWelcomeMember);
});

Bot.on("guildMemberRemove", (member: Discord.GuildMember): void => {
    const channel: Discord.TextChannel = member.guild.channels.find(ch => ch.name === "welcome") as Discord.TextChannel;
    if (!channel) return;

    var richEmbedGoodbye: Discord.RichEmbed = new Discord.RichEmbed()
        .setTitle("A member just left :outbox_tray:")
        .setDescription(`Goodbye ${member.user.username}. We hope you'll come back :confused:`)
        .setTimestamp()
        .setColor("#FF0000")
        .setFooter(Bot.user.username, Bot.user.avatarURL);

    channel.send(richEmbedGoodbye);
});

Bot.on("error", (error: Error): void => {
    Logger.error(error);
});

Bot.on("message", (message: Discord.Message): void => {
    if (message.author.bot) return;
    if (!message.guild) return;

    checkXP(message.author.id);

    Logger.log("Test message");

    FS.readFile(`prefixes/${message.author.id}`, (err: Error, data): void => {
        Logger.log("Test prefix");
        let prefix: string = err ? "!" : data.toString();

        let msg: string = message.content.toUpperCase(); // uppercase? tu es sur?
        let args: string[] = message.content.slice(prefix.length).trim().split(" ");
        let cmd: string = args.shift().toLowerCase();

        if (!msg.startsWith(prefix)) return;

        let ops: {
            ownerID: string,
            active: any,
        } = {
            ownerID: ownerID,
            active: active,
        };

        FS.readFile(`languages/${message.author.id}`, (err, data) => {
            Logger.log("Test langue");
            if (err) {
                Logger.error(err);
                FS.writeFileSync(`languages/${message.author.id}`, "En");
            }
            try {
                require(`../out/commands/${data || "En"}/${cmd}.js`).run(Bot, message, args, ops);
                Logger.log(`${message.author.tag} just used the ${cmd} power.`);
            } catch (error) {
                message.reply("This command doesn't exist.").then((message: Discord.Message): Promise<Discord.Message> => message.delete(3000));
                Logger.error(error);
            }
        });

    });

    /**
     * Vérifie l'xp de l'utilisateur
     * 
     * @param {string} userId le numéro de l'utilisateur (en string) à vérifier
     */
    function checkXP(userId: string): void {

        Logger.log(FS.realpathSync(`ranks/${userId}`));

        let userXp: number;
        try {
            userXp = Number.parseInt(FS.readFileSync(`ranks/${userId}`).toString(), 10);

            userXp++;

            FS.writeFileSync(`ranks/${userId}`, userXp);

            if (userXp % 50 === 0 && userXp >= 50 && userXp <= 1000) {
                message.reply("Rank up! You are now level **" + Math.ceil(userXp / 50) + "**."); // message est pas accessible
            }

        } catch (e) {
            FS.writeFileSync(`ranks/${userId}`, 0);
        }
    }
});
