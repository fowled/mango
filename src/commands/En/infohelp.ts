import * as Discord from "discord.js";

// Help command

/**
 * Envoie l'aide en mp
 * @param {Discord.Client} Client le client
 * @param {Discord.Message} Message le message contenant la commande
 * @param {string[]} args les arguments de la commande
 * @param {any} options les options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
     var helpMessage: Discord.RichEmbed = new Discord.RichEmbed()
        .setTitle(`Help!`)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor(Math.floor(Math.random() * 16777214) + 1)
        .setDescription("**__Moderation commands:__**\n`ban, kick, warn, clear, pin`\n\n**__Guild commands:__**\n`userinfo, guildinfo, invite`\n\n**__Other commands:__**\n`say, infoping, uptime, play, leave, musicinfo`\n\n**__Scratch commands:__**\n`scratchcount, scmessages, scproj, scuser`")
        .setThumbnail(Client.user.avatarURL)
        .setFooter(Client.user.username, Client.user.avatarURL)
        .setTimestamp()
    Client.users.get(message.author.id).send(helpMessage).catch(console.error);
}