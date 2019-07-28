// Fun command

exports.run = async (client, message, args, tools) => {
    var messageToSay = message.content.split(" ");
    messageToSay = messageToSay.slice(1, messageToSay.length - 2);
    var taggedUser = message.mentions.users.first();
    var date = new Date;
    if (taggedUser) {
        message.channel.send("Message is sending :postbox:");
        client.users.get(taggedUser.id).send(`*${message.author.username} sent you: \`${messageToSay.join(" ")}\` at ${date.toLocaleString()}*.`)
            .catch(err => {
                message.channel.send("User is blocking DMs :frowning:");
            });
    } else {
        message.reply("I don't know who to send this, select a user please!");
    }
}