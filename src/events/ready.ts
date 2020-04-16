import * as Discord from "discord.js";

import * as Logger from "./../utils/Logger";

export default async (Client: Discord.Client) => {
	Logger.log("Client is ready");
	Client.user.setStatus("dnd");
	Client.user.setPresence({
		game: {
			name: `need help? !infohelp`,
			type: "STREAMING",
			url: "https://www.twitch.tv/discordapp.com"
		},
		status: "online",
	});
};
