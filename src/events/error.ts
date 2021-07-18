import * as Discord from "discord.js";
import * as Logger from "./../utils/Logger";

module.exports = {
	name: "error",
	execute(error: Error, Client: Discord.Client) {
		Logger.error(error.message);
	}
};

