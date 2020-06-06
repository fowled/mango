import * as Discord from "discord.js";
import ytdl from "ytdl-core";
import * as Logger from ".././utils/Logger";

// Music command

/**
 * Plays a song in a vocal channel that is on YouTube, SoundCloud...
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any): Promise<void> {
	const queue = ops.queue;
	const serverQueue = queue.get(message.guild.id);
	const voiceChannel: Discord.VoiceChannel = message.member.voice.channel;

	if (!voiceChannel) {
		message.channel.send("I'm sorry, but you need to be connected in a voice channel to start playing :musical_note:");
		return;
	}

	const permissions: Discord.PermissionResolvable = voiceChannel.permissionsFor(message.client.user);

	if (!args[0]) {
		message.reply("You must provide a link to the song I should play!");
		return;
	}

	if (!permissions.has("CONNECT")) {
		message.reply("I can't connect to the channel because I don't have permission to.");
		return;
	}

	if (!permissions.has("SPEAK")) {
		message.reply("Welp, it looks like I can't speak. Means that I can't play music. Add me the permission to!");
		return;
	}

	const validate: boolean = await ytdl.validateURL(args[0]);

	if (!validate) {
		message.reply("Hmm, the URL isn't valid... please try again.");
	}

	const songInfo: ytdl.videoInfo = await ytdl.getInfo(args[0]);

	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
		requester: message.author.tag,
		author: songInfo.author,
		length: songInfo.length_seconds,
		id: songInfo.video_id,
	}

	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};

		queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		message.channel.send(`Currently getting info from **${songInfo.title}**...`);

		try {
			var connection: Discord.VoiceConnection = await message.member.voice.channel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (err) {
			Logger.error(err);
			queue.delete(message.guild.id);
			message.channel.send("Couldn't join the voice channel.");
		}
	} else {
		serverQueue.songs.push(song);
		message.channel.send(`**${song.title}** has been added to the queue.`);
	}

	function play(guild: Discord.Guild, song) {
		const serverQueue = queue.get(guild.id);

		if (!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}

		const dispatcher: Discord.StreamDispatcher = serverQueue.connection.play(ytdl(song.url), { filter: "audioonly" })
			.on("finish", () => {
				Logger.log(`Finished playing song "${args[0]}"`);
				serverQueue.songs.shift();
				play(guild, serverQueue.songs[0]);
			})
			.on("error", error => {
				Logger.error(error);
			});

		dispatcher.setVolumeLogarithmic(5 / 5);

		message.channel.send(`Now playing: **${songInfo.title}**`);
		Logger.log(`Playing ${songInfo.title} on guild: ${message.member.guild.name}`);
	}
}
