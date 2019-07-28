exports.run = async (client, message, args, ops) => {
    
    var titleNotShown = true;
    exports.titleNotShown = titleNotShown;

    if (!message.member.voiceChannel) return message.channel.send("Merci de vous connecter à un channel vocal.");

    if (!message.guild.me.voiceChannel) return message.channel.send("Désolé, mais il semblerait que le bot ne soit pas connecté au channel.");

    if (message.guild.me.voiceChannelID != message.member.voiceChannelID) return message.channel.send("Désolé, mais il semblerait que vous n'êtes pas connecté au même channel vocal que moi...");

    message.member.voiceChannel.leave();

    return message.react('👍');
}