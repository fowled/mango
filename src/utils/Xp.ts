import * as Discord from "discord.js";
import * as Fs from "fs";

/**
 * Vérifie l'xp de l'utilisateur
 * @param {string} userId le numéro de l'utilisateur (en string) à vérifier
 */
export function checkXP(message: Discord.Message): void {
	let userXp: number;

	let data = Fs.readFileSync(`./database/ranks/ranks.json`, "utf8");
	data = JSON.parse(data);

	if (!data.hasOwnProperty(message.author.id)) {
		data[message.author.id] = 0;
		return Fs.writeFileSync(`./database/ranks/ranks.json`, JSON.stringify(data));
	}

	userXp = parseInt(data[message.author.id]);

	userXp++;

	data[message.author.id] = userXp;

	Fs.writeFileSync(`./database/ranks/ranks.json`, JSON.stringify(data));
}
