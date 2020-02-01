import * as Discord from "discord.js";

// Bot command

/**
 * Bot's uptime.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[]) {
	let totalSeconds: number = (client.uptime / 1000);
	const days: number = Math.floor(totalSeconds / 86400);
	const hours: number = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const minutes: number = Math.floor(totalSeconds / 60);
	const seconds: number = totalSeconds % 60;

	if (days === 0) {
		message.reply(`Bot is online since **${Math.round(hours)}** hours, **${Math.round(minutes)}** minutes and **${Math.round(seconds)}** seconds.`);
	} else if (days === 1) {
		message.reply(`Le bot est en ligne depuis **${Math.round(days)}** jour, **${Math.round(hours - (24))}** heure(s), **${Math.round(minutes)}** minutes and **${Math.round(seconds)}** seconds`);
	} else if (days !== 1) {
		message.reply(`Le bot est en ligne depuis **${Math.round(days)}** jours, **${Math.round(hours - (days * 24))}** hours, ${Math.round(minutes)} minutes and **${Math.round(seconds)}** seconds.`);
	}
}
