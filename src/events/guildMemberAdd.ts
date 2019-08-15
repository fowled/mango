import * as Discord from "discord.js";

import * as RichEmbed from "./../utils/Embed";

export default async (Client: Discord.Client, member: Discord.GuildMember) => {
	const welcomeChannel: Discord.TextChannel = member.guild.channels.find((ch) => ch.name === "welcome") as Discord.TextChannel;
	if (!welcomeChannel) {
		return;
	}

	welcomeChannel.send(RichEmbed.create(Client, {
		title: `A member just joined the guild :inbox_tray:`,
		description: `Welcome ${member}! We wish you to have fun in **${member.guild.name}**. Help message: type *!infohelp* in server!`,
		color: "#83FF00",
	}));

	Client.users.get(member.id).send(RichEmbed.create(Client, {
		title: `Welcome!`,
		description: `Welcome ${member!}! We wish you to have fun in **${member.guild.name}**. Help message: type *!infohelp* in server!`,
		color: "#83FF00",
	}));
};
