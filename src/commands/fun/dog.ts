import Discord from "discord.js";
import fetch from "node-fetch";

// Fun command

/**
 * Replies with a funny or cutie picture of a dog :3
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "dog",
	description: "Replies with a picture of a dog",
	category: "fun",
	botPermissions: ["ATTACH_FILES"],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message) {
		const req = await fetch("https://api.thedogapi.com/v1/images/search").then((res) => res.json());
		const catpic = new Discord.MessageAttachment(req[0].url);

		if (req[0].breeds.length !== 0) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(interaction.member.user.tag, interaction.member.user.avatarURL())
				.setColor("#0FB1FB")
				.setDescription("Here is some info about your dog.")
				.addField("Breed", req[0].breeds[0].name, true)
				.addField("Life span", req[0].breeds[0].life_span, true)
				.addField("Temperament", req[0].breeds[0].temperament)
				.setTimestamp()
				.setFooter(Client.user.username, Client.user.avatarURL());

			return interaction.editReply({ embeds: [embed], files: [catpic] });
		}

		interaction.editReply({ files: [catpic] });
	},
};
