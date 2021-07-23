import * as Discord from "discord.js";

// Guild command

/**
 * Generates an invitation in the server.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "invit",
	description: "Create an invitation link",
	category: "info",

	async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
		(await message.guild.fetch()).invites.create(message.channel.id)
			.then((invite: Discord.Invite) => {
				message.reply(invite.url);
			})
			.catch((err: Error) => {
				message.reply("I don't have the right perms ;( Make sure I have the admin rank :wink:");
			});
	}
}
