const DISCORD = require("discord.js");

exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id);

    let parseURL = fetched.queue[0].url.split('watch?v=')[1];

    var time = fetched.queue[0].songLength;
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;

    let reponse = new DISCORD.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`Informations pour ${message.author.tag}`)
        .setColor('#f98257')
        .addField('Titre de la musique', `:musical_note: - **${fetched.queue[0].songTitle}**`)
        .addField('Musique demandée par...', `L'utilisateur *${fetched.queue[0].requester}*`)
        .addField('Auteur de la musique', fetched.queue[0].songAuthor)
        .addField('Durée de la musique', `${minutes} minute(s) et ${seconds} secondes.`)
        .addField("Channel d'annonces", `Le channel <#${fetched.queue[0].announceChannel}>`)
        .setURL(`https://youtube.com/${fetched.queue[0].url}`)
        .setThumbnail(`https://img.youtube.com/vi/${parseURL}/0.jpg`)
        .setFooter(client.user.username, client.user.avatarURL)
        .setTimestamp()
    message.channel.send(reponse);
}