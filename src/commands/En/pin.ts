import * as Discord from "discord.js";

// Moderation command

/**
 * Pins a message.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[]) {
	message.channel.fetchMessage(args[0])
		.then((message) => message.pin())
		.catch(() => {
			message.reply("An error occured, make sure I have the pin permission.");
		});
}
