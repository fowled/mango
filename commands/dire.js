// Commande de modération

exports.run = async (client, message, args, tools) => {
    var commande = message.content.split(" ");
    commande = commande.slice(1, commande.length - 2);
    var mentionnedUser = message.mentions.users.first();
    var date = new Date;
    if (mentionnedUser) {
        message.channel.send("Le message va s'envoyer.");
        client.users.get(mentionnedUser.id).send(`*${message.author.username} vous a envoyé, à ${date.toLocaleString()}* : ${commande.join(" ")}`)
            .catch(err => {
                message.channel.send("L'utilisateur bloque ses messages.");
            });
    } else {
        message.reply("Merci de mentionner un utilisateur valide, et présent sur le serveur.");
    }
}