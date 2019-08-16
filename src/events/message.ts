import * as Discord from "discord.js";
import * as Fs from "fs";

import * as RichEmbed from "./../utils/Embed";
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

		Logger.log(Fs.realpathSync(`./languages/${message.author.id}`));
		Fs.readFile(`././languages/${message.author.id}`, (err: NodeJS.ErrnoException, data): void => {
			if (err) {
				Logger.error(err);
				Fs.writeFileSync(`././languages/${message.author.id}`, "En");
			}
			try {
				require(`./../commands/${data || "En"}/${cmd}.js`).run(Client, message, args, null);
				Logger.log(`${message.author.tag} just used the ${cmd} power.`);
			} catch (error) {
				message.reply("This command doesn't exist.").then((message: Discord.Message): Promise<Discord.Message> => message.delete(3000));
				Logger.error(error);
			}
		});

	});
};
