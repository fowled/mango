const FS = require('file-system');

// Preferences command

exports.run = async (client, message, args, ops) => {
    if (!args[0]) return message.channel.send("Preferences... what? !preferences prefix see`, `!preferences prefix set [prefix]`, `!preferences language set [En, Fr]`"); // menu des préférences

    if (args[0] == "prefix" && args[1] == "set") {
        if (args[2].length > 1) {
            message.reply("Prefix length cannot be longer than 1 character. Please retry.");
        } else {
            FS.writeFile(`prefixes/${message.author.id}.txt`, args[2]);
            message.reply(`Your prefix has been edited : \`${args[2]}\``);
        }

    } else if (args[0] == "prefix" && args[1] == "see") {
        FS.readFile(`prefixes/${message.author.id}.txt`, (err, data) => {
            if (!data) {
                message.reply("You have the default prefix - change it by entering `!preferences prefix set [prefix]`");
            } else {
                message.reply(`Your prefix: \`${data}\``);
            }

        });

    } else if (args[0] == "language" && args[1] == "set") {
        if (args[2] != "En" && args[2] != "Fr") {
            message.reply("I'm sorry, but the language you requested isn't available *for the moment*. Available languages: `En`, `Fr`");
        } else {
            FS.writeFile(`languages/${message.author.id}`, args[2]);
            message.reply(`Language edited! Your current language: \`${args[2]}\``);
        }
    } else {
        message.reply("Somehow my brain didn't understand your command... Please retry!");
    }
}