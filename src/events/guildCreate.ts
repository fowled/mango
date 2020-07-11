import * as Discord from "discord.js";

import * as MessageEmbed from "./../utils/Embed";

export default async (Client: Discord.Client, guild: Discord.Guild) => {
	const channel: Discord.TextChannel = guild.channels.resolve("welcome") as Discord.TextChannel;
	if (!channel) { return; }

	channel.send(MessageEmbed.create(Client, {
		title: `Hi, I'm ${Client.user.username} and I'm new in ${guild.name}!`,
		description: `Help message has been sent to ${guild.owner.user}, but they are also available typing *!infohelp*.`,
		thumbnail: {url: guild.iconURL()},
		color: "RANDOM",
	}));

	guild.owner.send(MessageEmbed.create(Client, {
		title: `Thank you for adding me in ${guild.name}!`,
		description: `Help message: *!infohelp*.`,
		thumbnail: {url: guild.iconURL()},
		color: "#4782F9",
	}));
};
