import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

export async function checkXP(message: Discord.Message, ops) {
	const Xp: Sequelize.ModelStatic<Sequelize.Model<any, any>> = ops.sequelize.model("ranks");

	const level = await Xp.findOne({ where: { idOfUser: message.member.user.id, idOfGuild: message.guild.id } });

	if (level) {
		level.increment("xp");
	} else {
		Xp.create({
			idOfUser: message.member.user.id, 
			nameOfUser: message.author.tag,
			xp: 0,
			idOfGuild: message.guild.id
		});
	}
}
