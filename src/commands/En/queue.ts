import * as Discord from "discord.js";

// Music command

exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) return message.channel.send("No music is currently played! Come join and add some!");

    let queue = fetched.queue;
    let nowPlaying = queue[0];
    let listMessage = '';

    for (var i = 1; i < queue.length; i++) {
        listMessage += `${i}- *${queue[i].songTitle}* - Demandé par **${queue[i].requester}**\n`;
    }

    if (listMessage == undefined) {
        let noQueueMessage = new Discord.RichEmbed()
            .setTitle(`Queue command for ${message.author.tag}`)
            .addField(`Now playing`, `*${nowPlaying.songTitle}* - Asked by **${nowPlaying.requester}**`)
            .setColor("#f98257")
            .setTimestamp()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setFooter(client.user.username, client.user.avatarURL)
        message.channel.send(noQueueMessage);
    } else {
        let withQueueMessage = new Discord.RichEmbed()
            .setTitle(`Queue command ${message.author.tag}`)
            .addField(`Now playing`, `*${nowPlaying.songTitle}* - Asked by **${nowPlaying.requester}**`)
            .addField('Queue', listMessage)
            .setColor("#f98257")
            .setTimestamp()
            .setAuthor(message.author.username, message.author.avatarURL)
            .setFooter(client.user.username, client.user.avatarURL)
        message.channel.send(withQueueMessage);
    }


}