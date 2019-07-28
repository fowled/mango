// Commande de modération

exports.run = async (client, message, args, tools) => {
    if (message.content.startsWith("!clear")) {
        var nbMessagesDelete = message.content.split(" ");
        nbMessagesDelete = commande.slice(1);
        if (isNaN(nbMessagesDelete[0])) {
            message.reply("Please select a number of messages to delete!");
        } else if (nbMessagesDelete[0] <= 100) {
            message.channel.bulkDelete(commande[0]);
        } else {
            message.reply("Number of messages to delete can't be higher than 100, ya know?");
            setTimeout(function () {
                message.channel.bulkDelete(100);
            }, 2000);
        }
    }
}