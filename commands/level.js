const FS = require("file-system");

exports.run = async (client, message, args, ops) => {

    message.channel.startTyping();

    setTimeout(function () {
        FS.readFile(`ranks/${message.author.id}.txt`, (err, data) => {

            let level = data / 50;
            level = level.toFixed(0);

            getExactLvl(level);

            function getExactLvl(lvl) {
                let finalLvl = lvl.split(".")[0];

                message.reply(`Votre niveau... XP: **${data}** Level: **${finalLvl}**.`);
            }



        });
    }, 2000)

    message.channel.stopTyping();

}