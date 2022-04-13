import Discord from "discord.js";

import { db } from "../index";

import { error } from "./Logger";

export async function insertLog(Client: Discord.Client, guildID: string, author, msg: string) {
	const logchannelmodel = db.model("logChannels");
	const logchannel = await logchannelmodel.findOne({ where: { idOfGuild: guildID } });

	if (!logchannel) return;

	const logChannelID = logchannel.get("idOfChannel") as string;

	const logMessageEmbed = new Discord.MessageEmbed().setAuthor(author.tag, author.avatarURL()).setColor("#2D2B2B").setDescription(msg).setFooter(Client.user.username, Client.user.avatarURL()).setTimestamp();

	try {
		((await Client.channels.fetch(logChannelID)) as Discord.TextChannel).send({ embeds: [logMessageEmbed] });
	} catch (e) {
		error(e);
	}
}
