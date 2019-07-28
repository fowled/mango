// Guild command

exports.run = async (client, message, args, tools) => {
    message.guild.channels.get(message.channel.id).createInvite().then(invite =>
        message.channel.send(invite.url)
    ).catch(err => {
        message.reply("I don't have the right perms ;( Make sure I have admin rank :wink:");
    });
}
