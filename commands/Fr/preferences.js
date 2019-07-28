const FS = require('file-system');

exports.run = async (client, message, args, ops) => {
    if (!args[0]) return message.channel.send("Argument ?"); // menu des préférences

    if (args[0] == "prefix" && args[1] == "set") {
        if (args[2].length > 1) {
            message.reply("Oups ! Le préfixe ne doit pas être plus long que 1 caractère. Veuillez réessayer.")
        } else {
            FS.writeFile(`prefixes/${message.author.id}.txt`, args[2]);
            message.reply(`Préfixe bien changé : ${args[2]}`);
        }

    } else if (args[0] == "prefix" && args[1] == "see") {
        FS.readFile(`prefixes/${message.author.id}.txt`, (err, data) => {
            if (!data) {
                message.reply("Vous n'avez actuellement aucun préfixe personnalisé enregistré. Pour en enregistrer un, faites `!preferences prefix set <préfixe>`.")
            } else {
                message.reply(`Votre préfixe actuellement enregistré: ${data}`);
            }

        });
    } else {
        message.reply("Je n'ai pas compris... Veuillez retaper la commande.");
    }
}