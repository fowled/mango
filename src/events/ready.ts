import * as Discord from "discord.js";

import * as Logger from "./../utils/Logger";
import { defModels } from "../models/models";

import { sequelizeinit } from ".././index";

const sequelize = sequelizeinit;

module.exports = {
	name: "ready",

	async execute(Client: Discord.Client) {
		await defModels();

		Logger.log("Synchronizing database models...");

		sequelize.sync();

		Client.user.setActivity("/help", { type: "WATCHING" });

		Logger.log(`All done - client is ready and is logged in as ${Client.user.tag}!`);

	}
};
