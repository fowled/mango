import * as Discord from "discord.js";
import ytdl from "ytdl-core";
import * as Logger from "../../utils/Logger";

// Music command

/**
 * Plays a song in a vocal channel that is on YouTube, SoundCloud...
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any): Promise<void> {
	const voiceChannel: Discord.VoiceChannel = message.member.voiceChannel;

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
		message.reply("Welp, it looks like I can't speak. Like, I can't play music. Add me the permission to!");
		return;
	}

	const validate: boolean = await ytdl.validateURL(args[0]);

	if (!validate) {
		message.reply("Hmm, the URL isn't valid... please try again.");
	}

	const info: ytdl.videoInfo = await ytdl.getInfo(args[0]);
	const connection: Discord.VoiceConnection = await message.member.voiceChannel.join();
	const dispatcher: Discord.StreamDispatcher = await connection.playStream(ytdl(args[0], { filter: "audioonly" }));

	message.channel.send(`Now playing: **${info.title}**`);
	Logger.log(`Playing ${info.title} on guild: ${message.member.guild.name}`)

	dispatcher.setVolumeLogarithmic(5 / 5);
}
