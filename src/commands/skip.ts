import * as Discord from "discord.js";

// Music command

/**
 * Skips actual guild music.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const fetched: any = ops.active.get(message.guild.id);

	if (!fetched) {
		return message.channel.send("No music is actually played.");
	}

	fetched.dispatcher.emit("end");
}
