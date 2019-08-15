import * as Discord from "discord.js";

// Music command

export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const fetched = ops.active.get(message.guild.id);

	if (!fetched) {
		return message.channel.send("No music is actually played.");
	}

	fetched.dispatcher.emit("end");
}
