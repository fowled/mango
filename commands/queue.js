const DISCORD = require("discord.js");

exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) return message.channel.send("Il n'y a pour l'instant aucune musique de jouée !");

    let queue = fetched.queue;
    let nowPlaying = queue[0];
    let resp = '';

    for (var i = 1; i < queue.length; i++) {
        resp += `${i}- *${queue[i].songTitle}* - Demandé par **${queue[i].requester}**\n`;
    }

    if (resp == undefined) {
        let reponse = new DISCORD.RichEmbed()
            .setTitle(`Commande queue pour ${message.author.tag}`)
            .addField(`En train de jouer`, `*${nowPlaying.songTitle}* - Demandé par **${nowPlaying.requester}**`)
        message.channel.send(reponse);
    } else {
        let reponse = new DISCORD.RichEmbed()
            .setTitle(`Commande queue pour ${message.author.tag}`)
            .addField(`En train de jouer`, `*${nowPlaying.songTitle}* - Demandé par **${nowPlaying.requester}**`)
            .addField('Queue', resp)
        message.channel.send(reponse);
    }


}