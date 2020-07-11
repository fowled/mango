import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";

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
				.catch((error: Error) => message.reply("I don't have the permission to delete messages."));
			LogChecker.insertLog(Client, message.guild.id, message.author, `**${args[0]}** messages got deleted in *${message.channel}* by ${message.author.tag}`);

		} else {
			message.reply("Invlid number provided. Only provided number between 1 and 100");
		}
	} else {
		message.reply("Please enter the number of messages to delete!");
	}
}

const info = {
    name: "clear",
    description: "Clear messages",
    category: "moderation",
    args: "[number of messages to clear]"
}

export { info };
