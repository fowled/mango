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

    } else if (args[0] == "language" && args[1] == "set") {
        if (args[2] != "En" && args[2] != "Fr") {
            message.reply("Je suis désolé, mais ce langage n'est pas encore disponible - langues disponibles : `En`, `Fr`");
        } else {
            FS.writeFile(`languages/${message.author.id}`, args[2]);
            message.reply(`La langue a été changée! \`${args[2]}\``);
        }
    } else {
        message.reply("Eh, je n'ai pas compris quel paramètre changer. Réessaye! `!preferences prefix see`, `!preferences prefix set [préfixe]`, `!preferences language set [En, Fr]`");
    }
    
}