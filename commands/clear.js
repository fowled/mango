// Commande de modération

exports.run = async (client, message, args, tools) => {
    if (message.content.startsWith("!clear")) {
        var commande = message.content.split(" ");
        commande = commande.slice(1);
        if (isNaN(commande[0])) {
            message.reply("Merci d'entrer un nombre de messages à supprimer !");
        } else if (commande[0] <= 100) {
            message.channel.bulkDelete(commande[0]);
        } else {
            message.reply("Le nombre de messages à supprimer étant trop grand, je n'en supprimerai que 100.")
            setTimeout(function () {
                message.channel.bulkDelete(100);
            }, 2000);
        }
    }
}