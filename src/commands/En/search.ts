import * as Discord from "discord.js";
import * as search from "yt-search";

// Music command

/**
 * Searches for a music in YouTube, SoundCloud, and more. Works with the "play.ts" command.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	search(args.join(" "), (err, res) => {
		if (err) {
			return message.reply("An error occured, please retry...");
		}

		const videos = res.videos.slice(0, 1);
		const commandFile = require("./play.js");

		commandFile.run(Client, message, [videos[0].url], ops);
	});
}
