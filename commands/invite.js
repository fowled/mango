// Commande liée au serveur

exports.run = async (client, message, args, tools) => {
    message.guild.channels.get(message.channel.id).createInvite().then(invite =>
        message.channel.send(invite.url)
    ).catch(err => {
        message.reply("Une erreur s'est produite, il se peut que je n'ai pas les permissions nécessaires pour créer l'invitation.");
    });
}
