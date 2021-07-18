import * as Discord from "discord.js";

import * as Logger from "./../utils/Logger";
import { defModels } from "../models/models";

import { sequelizeinit } from ".././index";

const sequelize = sequelizeinit;

defModels();

module.exports = {
	name: "ready",
	execute(Client: Discord.Client) {
		Logger.log("Synchronizing database models...");

		let models = ["marketItems", "inventoryItems", "moneyAcc", "welChannels", "logChannels", "ranks"];

		for (let i = 0; i < 6; i++) {
			sequelize.model(models[i]).sync();
		}

		const statuses = ["WATCHING - slash commands", "PLAYING - with my users", `COMPETING - ${Client.guilds.cache.size} guilds`, "LISTENING - ma!help"];

		Logger.log(`All done - client is ready and is logged in as ${Client.user.tag}!`);

		switchStatuses();

		function switchStatuses() {
			let counter: number = 0;

			setInterval(() => {
				Client.user.setActivity(statuses[counter].split("-")[1].trim(), { type: statuses[counter].split("-")[0].trim() as unknown as number });
				
				if (counter === 3) {
					counter = 0;
				} else {
					counter++;
				}
			}, 60000 * 5);
		}
	}
};
