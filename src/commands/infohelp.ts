import * as Discord from "discord.js";
import * as Logger from ".././utils/Logger";

// Help command

/**
 * Answers with the infohelp message in dm.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
	const helpMessage: Discord.RichEmbed = new Discord.RichEmbed()
		.setTitle(`Help!`)
		.setAuthor(message.author.username, message.author.avatarURL)
		.setColor(Math.floor(Math.random() * 16777214) + 1)
		.setDescription(
			"**__Moderation commands:__**\n" +
			"`ban, kick, mute, tempmute, warn, clear, pin`\n\n" +
			"**__Guild commands:__**\n" +
			"`userinfo, servinfo, invit`\n\n" +
			"**__Other commands:__**\n" +
			"`dog, cat, hastebin, say, pp, preferences, queue, reac, talk, skip, time, weather, pin, level, ping, uptime, play, leave, musicinfo`\n\n" +
			"**__Scratch commands:__**\n" +
			"`scmessages, scproj, scuserinfo`")
		.setThumbnail(Client.user.avatarURL)
		.setFooter(Client.user.username, Client.user.avatarURL)
		.setTimestamp();
	Client.users.get(message.author.id)
		.send(helpMessage)
		.catch((error: Error) => {
			Logger.error(error);
		});
}
