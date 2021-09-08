import * as Discord from "discord.js";

// Guild command

/**
 * Generates an invitation in the server.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "invit",
	description: "Create an invitation link",
	category: "info",
	botPermissions: ["CREATE_INSTANT_INVITE"],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message) {
		(await interaction.guild.fetch()).invites.create(interaction.channel.id)
			.then((invite: Discord.Invite) => {
				interaction.reply(invite.url);
			})
			.catch(() => {
				interaction.reply("I don't have the right perms ;( Make sure I have the admin rank :wink:");
			});
	}
}
