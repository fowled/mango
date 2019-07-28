const DISCORD = require("discord.js");

exports.run = async (client, message, args, ops) => {
    helpMessage = new DISCORD.RichEmbed()
        .setTitle(`Help!`)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor(Math.floor(Math.random() * 16777214) + 1)
        .setDescription("**__Moderation commands:__**\n`ban, kick, warn, clear, pin`\n\n**__Guild commands:__**\n`userinfo, guildinfo, invite`\n\n**__Other commands:__**\n`say, infoping, uptime, play, leave, musicinfo`\n\n**__Scratch commands:__**\n`scratchcount, scmessages, scproj, scuser`")
        .setThumbnail(client.user.avatarURL)
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp()
    client.users.get(message.author.id).send(helpMessage).catch(console.error).then(message.reply(":thumbsup: Help message just sent!"));
}