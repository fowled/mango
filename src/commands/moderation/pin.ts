import * as Discord from "discord.js";
import { replyMsg } from "../../utils/InteractionAdapter";

// Moderation command

/**
 * Pins a message.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "pin",
	description: "Pins a message",
	category: "moderation",
	options: [
		{
			name: "id",
			type: "STRING",
			description: "The ID of the message to pin",
			required: true
		}
	],

	async execute(Client: Discord.Client, message: Discord.Message & Discord.CommandInteraction, args, ops) {
		if (!args[0]) {
			return message.reply("You need to specify the message's ID so that I can pin it.");
		}

		let msg = await message.reply("Trying to pin the message...");

		message.channel.messages.fetch(args[0])
			.then((pinmessage: Discord.Message) => {
				pinmessage.pin().then(() => {
					replyMsg(message, "I successfully pinned the message.", msg, true);
				});
			}).catch(() => {
				message.reply("An error occured, make sure I have the pin permission.");
			});

	}
}
