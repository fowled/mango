import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

// Fun command

/**
 * Shows XP/Level of the user.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "level",
	description: "Replies with your Mango level and XP",
	category: "fun",

	async execute(Client: Discord.Client, message: Discord.Message & Discord.CommandInteraction, args, ops) {
		const Xp: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("ranks");
		const fetchUser = await Xp.findOne({ where: { idOfUser: message.member.user.id } });
		const userXp: any = fetchUser.get("xp") as number;
	
	
		const levelEmbedMessage: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setTitle(`${message.member.user.tag} level`)
			.setAuthor(message.member.user.username, message.member.user.avatarURL())
			.setDescription(`Your level - :gem: XP: **${fetchUser.get("xp")}** | :large_orange_diamond: Level: *${Math.floor(userXp / 50)}*`)
			.setColor("#019FE9")
			.setFooter(Client.user.username, Client.user.avatarURL())
			.setTimestamp()
		message.reply({ embeds: [levelEmbedMessage], ephemeral: true });
	}
}
