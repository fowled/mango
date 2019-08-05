// Commande de modération

exports.run = async (client, message, args, ops) => {
    message.channel.fetchMessage(args[0])
        .then(message => message.pin())
        .catch(function () {
            message.reply("Le message n'a pas pu être épinglé.");
        });
}