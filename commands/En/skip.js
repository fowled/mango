// Commande de musique

exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) return message.channel.send('Aucune chanson n\'est en cours dans le serveur !');

    fetched.dispatcher.emit('end');

}