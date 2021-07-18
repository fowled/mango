import * as Discord from "discord.js";

import * as Logger from "./../utils/Logger";
import * as Xp from "./../utils/Xp";

import { ops } from "../index";

module.exports = {
	name: "message",
	execute(message: Discord.Message, Client: Discord.Client) {
		if (message.member.user.bot) return;

		const prefix: string = "ma!";

		Xp.checkXP(message, ops);

		const args: string[] = message.content.slice(prefix.length).trim().split(/ +/);
		const command: string = args.shift().toLowerCase();

		if (!message.content.startsWith(prefix) || !Client.commands.has(command)) return;

		try {
			Client.commands.get(command).execute(Client, message, args, ops);
			Logger.log(`${message.member.user.tag} ran the ${Client.commands.get(command).name} command in ${message.guild.name}`);
		} catch (error) {
			Logger.error(error);
		}
	}
};
