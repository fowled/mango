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

    /*let messageArray = message.content.split(" ");
    let thing = messageArray.slice(1);

    let dUser = message.mentions.users.first();
    if (!dUser) return message.channel.send("Can't find user!");
    let parseUser = parseInt(dUser);

    let subr = thing.join(" ");
    if (!subr) return message.reply('You must supply a message!');

    client.user.createDM({
        user: parseUser,
        message: subr
    });

    message.author.send(`${message.author} You have sent your message to ${dUser}`);*/
}