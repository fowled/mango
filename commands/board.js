// Commande en rapport avec les rangs

const FS = require("file-system");

exports.run = async (client, message, args, ops) => {

    FS.readdir('ranks', function (err, items) {
        console.log(items);
        let ranks = [];

        for (var i = 0; i < items.length; i++) {
            FS.readFile(`ranks/${items[i]}`, (err, data) => {
                if (err) throw err;
                ranks.push(data);
                ranks.sort(compareRanks);
                message.reply("```" + ranks.join(` --- \n`) + "```");

            });

        }

    });

    function compareRanks(a, b) {
        return a - b;
    }

}