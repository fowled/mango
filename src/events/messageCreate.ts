import * as Discord from "discord.js";

import * as Xp from "../utils/Xp";
import { db } from "../index";

module.exports = {
	name: "messageCreate",
	async execute(message: Discord.Message) {
        if (!message.author.bot) return Xp.checkXP(message, db);
	}
};
