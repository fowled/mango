const ytdl = require('ytdl-core');
const DISCORD = require("discord.js");
const BOT = new DISCORD.Client();
//const ffmpeg = require('FFMPEG');

exports.run = async (client, message, args, ops) => {
    if (!message.member.voiceChannel) return message.channel.send("Connecte-toi à un channel vocal et réessaye la commande");

    if (!args[0]) return message.channel.send("Merci d'ajouter une url après la commande, pour savoir quelle musique je dois jouer.");

    let validate = await ytdl.validateURL(args[0]);

    if (!validate) return message.channel.send("Merci d'indiquer un url valide.");

    message.channel.send("En train de chercher la musique...");

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
        message.channel.send(`Ajouté à la liste : **${info.title}** - Demandé par **${message.author.tag}**`);
    }
    ops.active.set(message.guild.id, data);
}

async function play(client, ops, data) {
    client.channels.get(data.queue[0].announceChannel).send(`En train de jouer : **${data.queue[0].songTitle}** - Demandé par **${data.queue[0].requester}**`);

    data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: 'audioonly' }));
    data.dispatcher.guildID = data.guildID;

    data.dispatcher.once('end', function () {
        finish(client, ops, this);
    });
}

function finish(client, ops, dispatcher) {
    let fetched = ops.active.get(dispatcher.guildID);

    fetched.queue.shift();

    if (fetched.queue.length > 0) {
        ops.active.set(dispatcher.guildID, fetched);
        play(client, ops, fetched);
    } else {
        ops.active.delete(dispatcher.guildID);
        let vc = client.guilds.get(dispatcher.guildID).me.voiceChannel;

        if (vc) vc.leave();
    }
}