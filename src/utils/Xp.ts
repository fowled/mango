import Discord from "discord.js";
import Sequelize from "sequelize";

export async function checkXP(message: Discord.Message, db: Sequelize.Sequelize) {
	const Xp = db.model("ranks");

	const level = await Xp.findOne({ where: { idOfUser: message.member.user.id, idOfGuild: message.guild.id } });

	if (level) {
		level.increment("xp");
	} else {
		Xp.create({
			idOfUser: message.member.user.id,
			nameOfUser: message.author.tag,
			xp: 0,
			idOfGuild: message.guild.id,
		});
	}
}
