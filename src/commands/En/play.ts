import * as Discord from "discord.js";
import ytdl from "ytdl-core";

// Music command

/**
 * Plays a song in a vocal channel that is on YouTube, SoundCloud...
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const voiceChannel: Discord.VoiceChannel = message.member.voiceChannel;
	const permissions: Discord.PermissionResolvable = voiceChannel.permissionsFor(message.client.user);
	let servers = {};

	if (!voiceChannel) {
		return message.channel.send("I'm sorry, but you need to be connected in a voice channel to start playing :musical_note:");
	} else if (!args[0]) {
		message.reply("You must provide a link to the song I should play!");
	} else if (!permissions.has("CONNECT")) {
		message.reply("I can't connect to the channel because I don't have permission to.");
	} else if (!permissions.has("SPEAK")) {
		message.reply("Welp, it looks like I can't speak. Like, I can't play music. Add me the permission to!");
	}

	try {
		var connection = await voiceChannel.join();
	} catch (error) {
		console.error(`I couldn't join the voice channel, error: ${error}`);
		return message.channel.send(`Unexpected error, please try again the command. \`\`\`${error}\`\`\``);
	}

	const dispatcher = connection.playStream(ytdl(args[0]))
		.on('end', () => {
			console.log("Song ended.");
			voiceChannel.leave();
		})
		.on('error', error => {
			console.error(error);
		});

	dispatcher.setVolumeLogarithmic(5 / 5);

}
