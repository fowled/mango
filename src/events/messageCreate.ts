import * as Discord from "discord.js";

import * as Logger from "../utils/Logger";
import * as Xp from "../utils/Xp";

import { ops } from "../index";

module.exports = {
	name: "messageCreate",
	async execute(message: Discord.Message, Client: Discord.Client) {
		/* if (Client.application?.owner) await Client.application?.fetch();
		if (message.author.bot) return;

		const prefix: string = "/";

		Xp.checkXP(message, ops);

		const args: string[] = message.content.slice(prefix.length).trim().split(/ +/);
		const command: string = args.shift().toLowerCase();

		if (!message.content.startsWith(prefix) || clientCommands.has(command)) return;

		try {
			clientCommands.get(command).execute(Client, message, args, ops);
			Logger.log(`${message.member.user.tag} ran the ${clientCommands.get(command).name} command in ${message.guild.name}`);
		} catch (error) {
			Logger.error(error);
		} */

		return;
	}
};
