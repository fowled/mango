import * as Discord from "discord.js";
import ytdl from "ytdl-core";

import * as leave from "./leave";

// Music command

/**
 * Plays a song in a vocal channel that is on YouTube, SoundCloud...
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	if (!message.member.voiceChannel) {
		return message.channel.send("Please connect to a vocal channel and retry.");
	}

	if (!args[0]) {
		return message.channel.send("Retry the command with a URL (YouTube, Soundcloud...)");
	}

	const validate = await ytdl.validateURL(args[0]);

	if (!validate) {
		const commandFile = require("./search.js");

		return commandFile.run(client, message, args, ops);
	}

	message.channel.send("Searching music :musical_note:");

	const info = await ytdl.getInfo(args[0]);

	const data = ops.active.get(message.guild.id) || {};

	if (!data.connection) {
		data.connection = await message.member.voiceChannel.join();
	}

	if (!data.queue) {
		data.queue = [];
	}

	data.guildID = message.guild.id;

	data.queue.push({
		songTitle: info.title,
		songAuthor: info.author.name,
		songLength: info.length_seconds,
		requester: message.author.tag,
		url: args[0],
		announceChannel: message.channel.id,
	});

	if (!data.dispatcher) {
		play(client, ops, data);
	} else {
		message.channel.send(`Added to the list: **${info.title}** - Asked by **${message.author.tag}**`);
	}
	ops.active.set(message.guild.id, data);
}

async function play(client, ops, data) {
	data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, { filter: "audioonly" })); // tu peux m'aider ici?
	data.dispatcher.guildID = data.guildID;

	data.dispatcher.once("end", () => {
		finish(client, ops, this);
	});

	if (leave.titleNotShown !== true) {
		// leave.titleNotShown = false;
		client.channels.get(data.queue[0].announceChannel).send(`Now playing: **${data.queue[0].songTitle}** - Asked by **${data.queue[0].requester}**`);
	}
}

function finish(client, ops, dispatcher) {
	const fetched = ops.active.get(dispatcher.guildID);
	fetched.queue.shift();

	if (fetched.queue.length > 0) {
		ops.active.set(dispatcher.guildID, fetched);
		return play(client, ops, fetched);
	} else {
		ops.active.delete(dispatcher.guildID);
		const vc = client.guilds.get(dispatcher.guildID).me.voiceChannel;
		if (vc) {
			vc.leave();
		}
	}
}
