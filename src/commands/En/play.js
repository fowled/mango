const ytdl = require('ytdl-core');
var module = require("./leave.js");

// Music command

exports.run = async (client, message, args, ops) => {
    if (!message.member.voiceChannel) return message.channel.send("Please connect to a vocal channel and retry.");

    if (!args[0]) return message.channel.send("Retry the command with a URL (YouTube, Soundcloud...)");

    let validate = await ytdl.validateURL(args[0]);

    if (!validate) {
        let commandFile = require("./search.js");

        return commandFile.run(client, message, args, ops);
    }

    message.channel.send("Searching music :musical_note:");

    let info = await ytdl.getInfo(args[0]);

    let data = ops.active.get(message.guild.id) || {};

    if (!data.connection) data.connection = await message.member.voiceChannel.join();
    if (!data.queue) data.queue = [];
    data.guildID = message.guild.id;

    data.queue.push({
        songTitle: info.title,
        songAuthor: info.author.name,
        songLength: info.length_seconds,
        requester: message.author.tag,
        url: args[0],
        announceChannel: message.channel.id
    });

    if (!data.dispatcher) play(client, ops, data);
    else {
        message.channel.send(`Added to the list: **${info.title}** - Asked by **${message.author.tag}**`);
    }
    ops.active.set(message.guild.id, data);
}

async function play(client, ops, data) {
    data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: 'audioonly' }));
    data.dispatcher.guildID = data.guildID;

    data.dispatcher.once('end', function () {
        finish(client, ops, this);
    });
    
    if (module.titleNotShown != true) {
        module.titleNotShown == false;
        client.channels.get(data.queue[0].announceChannel).send(`Now playing: **${data.queue[0].songTitle}** - Asked by **${data.queue[0].requester}**`);
    }
}

function finish(client, ops, dispatcher) {
    let fetched = ops.active.get(dispatcher.guildID);
    fetched.queue.shift();

    if (fetched.queue.length > 0) {
        ops.active.set(dispatcher.guildID, fetched);
        return play(client, ops, fetched);
    } else {
        ops.active.delete(dispatcher.guildID);
        let vc = client.guilds.get(dispatcher.guildID).me.voiceChannel;
        if (vc) vc.leave();
    }

}