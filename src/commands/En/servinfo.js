const DISCORD = require("discord.js");

// Commande relative aux membres/serveur

exports.run = async (client, message, args, ops) => {

    if (message.content.startsWith('!servinfo')) {
        var afkChannel;
        var guildPicture = message.member.guild.iconURL;

        if (message.member.guild.afkChannel) {
            afkChannel = `#<${message.member.guild.afkChannel}>`;
        } else {
            afkChannel = "No AFK channel.";
        }

        reponse = new DISCORD.RichEmbed()
            .setTitle(`Informations serveur pour ${message.author.username}`)
            .setThumbnail(guildPicture)
            .setAuthor(`${message.author.username}`, message.author.avatarURL)
            .setDescription(`Informations à propos du serveur Discord ${message.member.guild.name} :`)
            .setColor(Math.floor(Math.random() * 16777214) + 1)
            .addField('Membres', `${message.member.guild.members.filter(member => !member.user.bot).size} humains et ${message.member.guild.members.filter(member => member.user.bot).size} bots`, true)
            .addField("Channels", `${message.member.guild.channels.filter(channel => channel.type == "text").size} textuels et ${message.member.guild.channels.filter(channel => channel.type == "voice").size} vocaux`, true)
            .addField('Propriétaire', message.member.guild.owner, true)
            .addField('Région', message.member.guild.region, true)
            .addField('Création', message.member.guild.createdAt.toLocaleString(), true)
            .addField('Channel AFK', afkOuPas, true)
            .setFooter(client.user.username, client.user.avatarURL, true)
            .setTimestamp()
        message.channel.send(reponse);
    }
}