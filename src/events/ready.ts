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

		Client.user.setActivity("/help", { type: "WATCHING" });

		Logger.log(`All done - client is ready and is logged in as ${Client.user.tag}!`);

	}
};
