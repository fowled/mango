import * as Discord from "discord.js";
import * as search from "yt-search";

export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	search(args.join(" "), (err, res) => {
		if (err) {
			return message.reply("An error occured, please retry...");
		}

		const videos = res.videos.slice(0, 1);
		const commandFile = require("./play.js");

		commandFile.run(client, message, [videos[0].url], ops);
	});
}
