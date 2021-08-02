import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

// Fun command

/**
 * Shows XP/Level of the user.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "level",
	description: "Replies with your Mango level and XP",
	category: "fun",

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
		const Xp: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("ranks");
		const fetchUser = await Xp.findOne({ where: { idOfUser: interaction.member.user.id } });
		const userXp: any = fetchUser.get("xp") as number;


		const levelEmbedinteraction: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setTitle(`${interaction.member.user.tag} level`)
			.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
			.setDescription(`Your level - :gem: XP: **${fetchUser.get("xp")}** | :large_orange_diamond: Level: *${Math.floor(userXp / 50)}*`)
			.setColor("#019FE9")
			.setFooter(Client.user.username, Client.user.avatarURL())
			.setTimestamp()
		interaction.reply({ embeds: [levelEmbedinteraction], ephemeral: true });
	}
}
