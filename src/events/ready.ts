import * as Discord from "discord.js";

import * as Logger from "./../utils/Logger";

export default async (Client: Discord.Client) => {
	Logger.log("Client is ready");
	Client.user.setPresence({
		game: {
			name: `${Client.users.size} users owo`,
			type: "WATCHING",
		},
		status: "online",
	});
};
