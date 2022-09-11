import Discord from "discord.js";
import chalk from "chalk";

import { log } from "utils/logger";

module.exports = {
	name: "ready",
	once: true,

	async execute(Client: Discord.Client) {
		Client.user.setActivity("/help", { type: "PLAYING" });

		log(`${chalk.yellow("logged in")} as ${chalk.magentaBright(Client.user.username)}`);
	},
};
