import * as Discord from "discord.js";

// Commande relative aux membres/serveur

export async function run(client: Discord.Client, message: Discord.Message, args: string[]) {

    if (message.content.startsWith('!servinfo')) {
        var afkChannel;
        var guildPicture = message.member.guild.iconURL;

        if (message.member.guild.afkChannel) {
            afkChannel = `#<${message.member.guild.afkChannel}>`;
        } else {
            afkChannel = "No AFK channel.";
        }

        const reponse = new Discord.RichEmbed()
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
            .addField('Channel AFK', afkChannel, true)
            .setFooter(client.user.username, client.user.avatarURL)
            .setTimestamp()
        message.channel.send(reponse);
    }
}