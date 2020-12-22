import * as Discord from "discord.js";

import * as Logger from "./../utils/Logger";
import { defModels } from "../models/models";

import { sequelizeinit } from ".././index";

const sequelize = sequelizeinit;

defModels();

export default async (Client: Discord.Client) => {
	Logger.log("Synchronizing database models...");

	let models = ["marketItems", "inventoryItems", "moneyAcc", "welChannels", "logChannels", "ranks"];

	for (let i = 0; i < 6; i++) {
		sequelize.model(models[i]).sync();
	}

	Logger.log(`All done - client is ready and is logged in as ${Client.user.tag}!`);

	setInterval(() => {
		Client.user.setActivity(`${Client.guilds.cache.size} guilds • ma!help`, { type: 5 });
	}, 60000);
};
