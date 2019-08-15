import * as Discord from "discord.js";

// Guild command

/**
 * Génère un lien d'invitation
 * @param {Discord.Client} Client le client
 * @param {Discord.Message} Message le message contenant la commande
 * @param {string[]} args les arguments de la commande
 * @param {any} options les options
 */

export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
	message.guild.channels.get(message.channel.id).createInvite()
	.then((invite: Discord.Invite) => {
		message.channel.send(invite.url);
	})
	.catch((err: Error) => {
		message.reply("I don't have the right perms ;( Make sure I have the admin rank :wink:");
	});
}
