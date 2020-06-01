import * as Discord from "discord.js";

import * as Logger from "./../utils/Logger";

export default async (Client: Discord.Client) => {
	Logger.log("Client is ready");
	
	setInterval(() => {
		const activitiesList = [`${Client.users.cache.size} users | ${Client.guilds.cache.size} guilds`, "ma!help", "@Mazz#0270", "the verified badge"]
		Client.user.setPresence({
			activity: {
				name: activitiesList[Math.floor(Math.random() * activitiesList.length)],
				type: "WATCHING",
				
			},
			status: "online",
		});
	}, 60000);
};
