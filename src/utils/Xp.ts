import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

export async function checkXP(message: Discord.Message, ops) {
	const Xp: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("ranks");

	const level = await Xp.findOne({ where: { idOfUser: message.author.id } });

	if (level) {
		level.increment("xp");
	} else {
		Xp.create({
			idOfUser: message.author.id, 
			xp: 0
		});
	}

	/* let userXp: number;

	let data = Fs.readFileSync(`./database/ranks/ranks.json`, "utf8");
	data = JSON.parse(data);

	if (!data.hasOwnProperty(message.author.id)) {
		data[message.author.id] = 0;
		return Fs.writeFileSync(`./database/ranks/ranks.json`, JSON.stringify(data));
	}

	userXp = parseInt(data[message.author.id]);

	userXp++;

	data[message.author.id] = userXp;

	Fs.writeFileSync(`./database/ranks/ranks.json`, JSON.stringify(data)); */
}
