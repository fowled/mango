import Discord from "discord.js";

import { prisma } from "index";

import { error } from "./logger";

export async function insertLog(Client: Discord.Client, guildID: string, author: Discord.User, msg: string) {
	const logchannel = await prisma.logChannels.findUnique({ where: { idOfGuild: guildID } });

	if (!logchannel) return;

	const logChannelID = logchannel.idOfChannel;

	const logMessageEmbed = new Discord.MessageEmbed()
		.setAuthor(author.tag, author.avatarURL())
		.setColor("#2D2B2B")
		.setDescription(msg)
		.setFooter(Client.user.username, Client.user.avatarURL())
		.setTimestamp();

	try {
		((await Client.channels.fetch(logChannelID)) as Discord.TextChannel).send({ embeds: [logMessageEmbed] });
	} catch (e) {
		error(e);
	}
}
