import Discord from "discord.js";
import fetch from "node-fetch";

// Fun command

/**
 * Replies with a funny or cutie picture of a dog :3
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "dog",
	description: "Replies with a picture of a dog",
	category: "fun",
	botPermissions: ["ATTACH_FILES"],

	async execute(_Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction) {
		const req = await fetch("https://api.thedogapi.com/v1/images/search").then((res) => res.json());

		const catpic = new Discord.AttachmentBuilder(req[0].url);

		return interaction.editReply({ files: [catpic] });
	},
};
