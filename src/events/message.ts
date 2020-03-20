import * as Discord from "discord.js";
import * as Fs from "fs";

import * as Logger from "./../utils/Logger";
import * as Xp from "./../utils/Xp";

export default async (Client: Discord.Client, message: Discord.Message) => {
	if (message.author.bot || !message.guild) {
		return;
	}

	Xp.checkXP(message);

	Fs.readFile(`./prefixes/${message.author.id}`, (err: Error, data): void => {
		const prefix: string = err ? "!" : data.toString();

		const msg: string = message.content;
		const args: string[] = message.content.slice(prefix.length).trim().split(" ");
		const cmd: string = args.shift().toLowerCase();

		if (!msg.startsWith(prefix)) {
			return;
		}

		try {
			require(`./../commands/${cmd}.js`).run(Client, message, args, null);
		} catch (err) {
			message.reply("I'm sorry, but the command you're looking for doesen't exist... :eyes:").then((msg: Discord.Message) => {
				msg.delete(3000);
			});
		}

		Logger.log(`${message.author.tag} just used the ${cmd} power in ${message.guild.name}.`);
	});
};