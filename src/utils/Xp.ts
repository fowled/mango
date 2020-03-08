import * as Discord from "discord.js";
import * as Fs from "fs";

/**
 * Vérifie l'xp de l'utilisateur
 * @param {string} userId le numéro de l'utilisateur (en string) à vérifier
 */
export function checkXP(message: Discord.Message): void {
	let userXp: number;
	try {
		userXp = Number.parseInt(Fs.readFileSync(`./database/ranks/${message.author.id}`).toString(), 10);

		userXp++;

		Fs.writeFileSync(`./database/ranks/${message.author.id}`, userXp);

		if (userXp % 50 === 0 && userXp >= 50 && userXp <= 1000) {
			message.reply("Rank up! You are now level **" + Math.ceil(userXp / 50) + "**.");
		}

	} catch (e) {
		Fs.writeFileSync(`./database/ranks/${message.author.id}`, 0);
	}
}
