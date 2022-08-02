import Discord from "discord.js";
import fetch from "node-fetch";

// Fun command

/**
 * Replies with a funny or cutie picture of a cat :3
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "cat",
	description: "Replies with a picture of a cat",
	category: "fun",
	botPermissions: ["ATTACH_FILES"],

	async execute(_Client: Discord.Client, interaction: Discord.CommandInteraction) {
		const req = await fetch("https://api.thecatapi.com/v1/images/search").then((res) => res.json());
		
		const catpic = new Discord.MessageAttachment(req[0].url);

		return interaction.editReply({ files: [catpic] });
	},
};
