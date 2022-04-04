import * as Discord from "discord.js";
import * as Sequelize from "sequelize";
import { db } from "../index";
import * as Logger from "./Logger";

export async function insertLog(Client: Discord.Client, guildID: string, author, msg: string) {
	const logchannelmodel: Sequelize.ModelStatic<Sequelize.Model> = db.model("logChannels");
	const logchannel: Sequelize.Model = await logchannelmodel.findOne({ where: { idOfGuild: guildID } });

	if (!logchannel) return;

	const logChannelID: string = logchannel.get("idOfChannel") as string;

	const logMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed().setAuthor(author.tag, author.avatarURL()).setColor("#2D2B2B").setDescription(msg).setFooter(Client.user.username, Client.user.avatarURL()).setTimestamp();

	try {
		((await Client.channels.fetch(logChannelID)) as Discord.TextChannel).send({ embeds: [logMessageEmbed] });
	} catch (e) {
		Logger.error(e);
	}
}
