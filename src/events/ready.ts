import * as Discord from "discord.js";

import * as Logger from "./../utils/Logger";

export default async (Client: Discord.Client) => {
	Logger.log("Client is ready");
	const activitiesList = [`${Client.users.size} users | ${Client.guilds.size} guilds`, "ma!help", "@Mazz#0270", "the verified badge"]

	setInterval(() => {
		Client.user.setPresence({
			game: {
				name: activitiesList[Math.floor(Math.random() * activitiesList.length)],
				type: "WATCHING"
			},
			status: "online",
		});
	}, 60000);
};
