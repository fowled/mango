import * as Discord from "discord.js";

import * as RichEmbed from "./../utils/Embed";

export default async (Client: Discord.Client, guild: Discord.Guild) => {
	const channel: Discord.TextChannel = guild.channels.find((ch) => ch.name === "welcome") as Discord.TextChannel;
	if (!channel) { return; }

	channel.send(RichEmbed.create(Client, {
		title: `Hi, I'm ${Client.user.username} and I'm pretty new in ${guild.name}!`,
		description: `Help message has been sent to ${guild.owner.user}, but they are also available typing *!infohelp*.`,
		thumbnail: {url: guild.iconURL,},
		color: Math.floor(Math.random() * 16777214) + 1,
	}));

	Client.users.get(guild.owner.id).send(RichEmbed.create(Client, {
		title: `Thank you for adding me in ${guild.name}!`,
		description: `Help message: *!infohelp*.`,
		thumbnail: {url: guild.iconURL},
		color: "#4782F9",
	}));
};
