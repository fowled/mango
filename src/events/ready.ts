import * as Discord from "discord.js";

import * as Logger from "./../utils/Logger";

module.exports = {
	name: "ready",

	async execute(Client: Discord.Client) {
		Client.user.setActivity("/help", { type: "WATCHING" });

		Logger.log(`All done - client is ready and is logged in as ${Client.user.tag}!`);
	},
};
