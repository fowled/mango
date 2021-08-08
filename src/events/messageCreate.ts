import * as Discord from "discord.js";

import * as Xp from "../utils/Xp";
import { ops } from "../index";

module.exports = {
	name: "messageCreate",
	async execute(message: Discord.Message, Client: Discord.Client) {
        Xp.checkXP(message, ops);
	}
};