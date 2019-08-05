// Moderation command

exports.run = async (client, message, args, ops) => {
    message.channel.fetchMessage(args[0])
        .then(message => message.pin())
        .catch(function () {
            message.reply("An error occured, make sure I have the pin permission.");
        });
}