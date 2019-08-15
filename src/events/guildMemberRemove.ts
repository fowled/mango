import * as Discord from "discord.js";

import * as RichEmbed from "./../utils/Embed";

export default async (Client: Discord.Client, member: Discord.GuildMember) => {
	const channel: Discord.TextChannel = member.guild.channels.find((ch) => ch.name === "welcome") as Discord.TextChannel;
	if (!channel) {
		return;
	}

	channel.send(RichEmbed.create(Client, {
		title: "A member just left :outbox_tray:",
		description: `Goodbye ${member.user.username}. We hope you'll come back :confused:`,
		color: "#FF0000",
	}));
};
