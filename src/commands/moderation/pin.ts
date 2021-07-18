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
	message.channel.messages.fetch(args[0] as unknown as `${bigint}`)
		.then((message: Discord.Message) => message.pin())
		.catch(() => {
			message.reply("An error occured, make sure I have the pin permission.");
		});
}

const info = {
    name: "pin",
    description: "Pin a message",
    category: "moderation",
    args: "[ID]"
}

export { info };
