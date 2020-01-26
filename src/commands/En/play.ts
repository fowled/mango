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
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any): Promise<void> {
	const voiceChannel: Discord.VoiceChannel = message.member.voiceChannel;
	const permissions: Discord.PermissionResolvable = voiceChannel.permissionsFor(message.client.user);

	if (!voiceChannel) {
		message.channel.send("I'm sorry, but you need to be connected in a voice channel to start playing :musical_note:");
		return;
	}
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

	voiceChannel.join()
	.then((connection: Discord.VoiceConnection): void => {
		connection
			.playFile("encore.mp3");
			//.playStream(ytdl(args[0], {filter: "audioonly"}));
			//.setVolumeLogarithmic(5 / 5);
	})
	.catch((error: Error): void => {
		console.error(`I couldn't join the voice channel, because of the following error: ${error}`);
		message.channel.send(`Unexpected error, please try again the command. \`\`\`${error}\`\`\``);
		return;
	});


	/*.on('end', () => {
		console.log("Song ended."); // FIXME: mis en commentaire, sinon ça quitte le channel en disant que la chanson est terminée alors que ça n'a même pas commencé à la jouer...
		voiceChannel.leave();
	})
	.on('error', error => {
		console.error(error);
	});*/

}
