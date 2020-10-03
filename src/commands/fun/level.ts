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
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const Xp: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("ranks");
	const fetchUser = await Xp.findOne({ where: { idOfUser: message.author.id } });
	const userXp: any = fetchUser.get("xp") as number;


	const levelEmbedMessage: Discord.MessageEmbed = new Discord.MessageEmbed()
		.setTitle(`${message.author.tag} level`)
		.setAuthor(message.author.username, message.author.avatarURL())
		.setDescription(`Your level - :gem: XP: **${fetchUser.get("xp")}** | :large_orange_diamond: Level: *${Math.floor(userXp / 50)}*`)
		.setColor("#019FE9")
		.setFooter(client.user.username, client.user.avatarURL())
		.setTimestamp()
	message.channel.send(levelEmbedMessage);
}

const info = {
	name: "level",
	description: "Replies with your Mango level and XP",
	category: "fun",
	args: "none"
}

export { info };

