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
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
	const helpMessage: Discord.MessageEmbed = new Discord.MessageEmbed()
		.setTitle(`Help!`)
		.setURL("https://github.com/Ma15fo43/Mango/wiki/Commands!")
		.setAuthor(message.author.username, message.author.avatarURL())
		.setColor(Math.floor(Math.random() * 16777214) + 1)
		.setDescription("https://github.com/Ma15fo43/Mango/wiki/Commands!")
		.setThumbnail(Client.user.avatarURL())
		.setFooter(Client.user.username, Client.user.avatarURL())
		.setTimestamp();
	
		message.author.send(helpMessage)
		.catch((error: Error) => {
			Logger.error(error);
		});
}
