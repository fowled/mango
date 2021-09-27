import * as Discord from "discord.js";

// Moderation command

/**
 * Pins a interaction.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "pin",
	description: "Pins a message",
	category: "moderation",
	botPermissions: ["MANAGE_MESSAGES"],
	memberPermissions: ["MANAGE_MESSAGES"],
	options: [
		{
			name: "id",
			type: "STRING",
			description: "The ID of the message to pin",
			required: true
		}
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
		await interaction.editReply("Trying to pin the interaction...");

		interaction.channel.messages.fetch(args[0])
			.then((pininteraction: Discord.CommandInteraction & Discord.Message) => {
				pininteraction.pin().then(() => {
					interaction.editReply("Successfully pinned the message!");
				});
			}).catch(() => {
				interaction.editReply("An error occured, make sure I have the pin permission.");
			});

	}
}
