import * as Discord from "discord.js";
import * as Fs from "fs";

import * as Logger from "./Logger";

export async function bind(Client: Discord.Client): Promise<void> {
	return new Promise<void>((resolve: (value?: void | PromiseLike<void>) => void, reject: (reason?: any) => void): void => {
		Fs.readdir("out/events/", (error: Error, files: string[]): void => {
			if (error) {
				Logger.error(error);
				reject(error);
			}

			files = files.filter((file: string): boolean => file.endsWith(".js"));
			for (const file of files) {
				const eventName: string = file.substring(0, file.length - 3);
				try {
					const eventModule: NodeModule = require(Fs.realpathSync(`./out/events/${file}`).toString());
					if (file)
					// @ts-ignore
					Client.on(eventName, eventModule.default.bind(null, Client)); // relie l'évent au module
					delete require.cache[require.resolve(Fs.realpathSync(`./out/events/${file}`).toString())];
				} catch (err) {
					Logger.error(err);
				}
			}
			Logger.log(`Loaded ${files.length} events`);
			resolve();
		});
	});
}
