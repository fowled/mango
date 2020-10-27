import * as Discord from "discord.js";
import ytdl from "ytdl-core";
import * as Logger from "../../utils/Logger";
import { search } from "yt-search";

// Music command

/**
 * Plays a song in a vocal channel that is on YouTube, SoundCloud...
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const queue = ops.queue;
	const serverQueue = queue.get(message.guild.id);
	const voiceChannel: Discord.VoiceChannel = message.member.voice.channel;
	let vidToPlay: any, vids: any, validate: boolean;

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

	if (!args[0].startsWith("https://")) {
		search(args.join(" "), (err, res) => {
			if (err) {
				return message.channel.send(`I didn't find any result matching **${args.join(" ")}**.`);
			}

			vids = res.videos.slice(0, 1);
			vidToPlay = vids[0].url;

			message.channel.send(`Searching **${args.join(" ")}**...`);

			validateSong(vidToPlay);
		});
	} else {
		vidToPlay = args[0];
		validateSong(vidToPlay);
	}

	function validateSong(song) {
		validate = ytdl.validateURL(song);

		if (!validate) {
			return message.channel.send("Looks like the song you submitted isn't valid. Please try another one.");
		}

		getInfoConstructQueue(song);
	}

	async function getInfoConstructQueue(music) {
		const songInfo: ytdl.videoInfo = await ytdl.getInfo(music);

		const song = {
			title: songInfo.videoDetails.title,
			url: songInfo.videoDetails.video_url,
			requester: message.author.tag,
			author: songInfo.videoDetails.author,
			length: songInfo.videoDetails.lengthSeconds,
			id: songInfo.videoDetails.videoId,
		}

		message.channel.send(`Currently getting info from **${song.title}**...`);

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
				serverQueue.songs.shift();
				play(guild, serverQueue.songs[0]);
			})
			.on("error", error => {
				Logger.error(error);
				message.channel.send("A super rare unknown error just happened. Oops.");
			});

		dispatcher.setVolumeLogarithmic(5 / 5);
		message.channel.send(`Now playing: **${song.title}**`);
	}
}

const info = {
    name: "play",
    description: "Tell Mango to play a song",
    category: "music",
    args: "[URL of the song, or search by keyword]"
}

export { info };
