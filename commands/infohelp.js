const DISCORD = require("discord.js");

exports.run = async (client, message, args, ops) => {
    reponse = new DISCORD.RichEmbed()
        .setTitle(`Aide pour le bot Mazz'Bot`)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor(Math.floor(Math.random() * 16777214) + 1)
        .setDescription("**__Commandes de modération:__**\n`ban, kick, warn, clear, pin, createrole, delrole`\n\n**__Commandes de serveur:__**\n`userinfo, servinfo, invite`\n\n**__Autres commandes:__**\n`heure, dire, sug, bug, infoping, infostats, invbot, uptime`\n\n**__Commandes liées à une API:__**\n`scratchcount, scmessages, scproj, scuser`")
        .setThumbnail(client.user.avatarURL)
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp()
    client.users.get(message.author.id).send(reponse).catch(console.error).then(message.reply("Message contenant l'aide envoyé."));
}