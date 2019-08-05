const DISCORD = require("discord.js");

exports.run = async (client, message, args, ops) => {
    let m = await message.channel.send("Ping?");

    let rep = new DISCORD.RichEmbed()
        .setTitle(`Informations de latence pour l'utilisateur ${message.author.tag}`)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor(Math.floor(Math.random() * 16777214) + 1)
        .setDescription("Informations de latence")
        .addField("Latence hébergeur", `**${m.createdTimestamp - message.createdTimestamp}** ms.`, true)
        .addField("Latence API", `**${Math.round(client.ping)}** ms.`, true)
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp()

    m.edit(rep);
}