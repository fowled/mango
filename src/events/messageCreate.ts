import Discord from "discord.js";

import { db } from "../index";

import { checkXP } from "../utils/Xp";

module.exports = {
	name: "messageCreate",
	async execute(_Client: Discord.Client, message: Discord.Message) {
		if (!message.author.bot) return checkXP(message, db);
	},
};
