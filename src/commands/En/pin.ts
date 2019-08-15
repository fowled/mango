import * as Discord from "discord.js";

// Moderation command

export async function run(client: Discord.Client, message: Discord.Message, args: string[]) {
	message.channel.fetchMessage(args[0])
		.then((message) => message.pin())
		.catch(() => {
			message.reply("An error occured, make sure I have the pin permission.");
		});
}
