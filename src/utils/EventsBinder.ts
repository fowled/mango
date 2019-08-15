import * as Discord from "discord.js";
import * as Fs from "fs";

import * as Logger from "./Logger";

export async function bind(Client: Discord.Client): Promise<void> {
	return new Promise<void>((resolve: (value?: void | PromiseLike<void>) => void, reject: (reason?: any) => void): void => {
		Fs.readdir("out/events/", (error: Error, files: string[]): void => {
			if (error) {
				Logger.error(error); // Marque dans la console s'il y a une erreur
				reject(error);
			}

			files = files.filter((file: string): boolean => file.endsWith(".js")); // trie les fichiers en prenant seulement les fichiers ayant une extension en .js
			for (const file of files) { // pour chaque fichier dans le dossier
				const eventName: string = file.substring(0, file.length - 3); // le nom de l'event, en retirant l'extension du fichier
				try {
					const eventModule: NodeModule = require(Fs.realpathSync(`./out/events/${file}`).toString()); // demande le module correspondant au nom
					// @ts-ignore
					Client.on(eventName, eventModule.default.bind(null, Client)); // relie l'évent au module
					delete require.cache[require.resolve(Fs.realpathSync(`./out/events/${file}`).toString())];
				} catch (err) {
					Logger.error(err);
				}
			}
			Logger.log(`Loaded ${files.length} events`); // Indique dans la console combien d'events ont été chargés
			resolve();
		});
	});
}
