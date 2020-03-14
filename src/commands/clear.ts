import * as Discord from "discord.js";
import * as LogChecker from "../utils/LogChecker";

// Mod command

/**
 * Deletes several messages at once.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
	if (args.length > 0) {
		if (!isNaN(parseInt(args[0], 10)) && parseInt(args[0], 10) >= 1 && parseInt(args[0], 10) <= 100) {
			message.channel.bulkDelete(parseInt(args[0], 10))
				.then(function () {
					LogChecker.insertLog(Client, message.author, message.guild.id, "clear", args[0])
				})
				.catch((error: Error) => message.reply("I don't have the permission to delete messages."));
		} else {
			message.reply("Invlid number provided. Only provided number between 1 and 100");
		}
	} else {
		message.reply("Please enter the number of messages to delete!");
	}
}
