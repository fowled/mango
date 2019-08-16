import * as Discord from "discord.js";

// Guild command

/**
 * Generates an invitation in the server.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	message.guild.channels.get(message.channel.id).createInvite()
	.then((invite: Discord.Invite) => {
		message.channel.send(invite.url);
	})
	.catch((err: Error) => {
		message.reply("I don't have the right perms ;( Make sure I have the admin rank :wink:");
	});
}
