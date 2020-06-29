import * as Discord from "discord.js";
import * as FS from "fs";

// Fun command

/**
 * Shows XP/Level of the user.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[]) {
	message.channel.startTyping();

	setTimeout(() => {
		FS.readFile(`database/ranks/ranks.json`, (err, data) => {
			if (err) {
				return message.reply("Sorry, but I got a problem fetching your level data. Please retry later and send this error to `@Mazz3015#2003`. " + `\`\`\`${err.message}\`\`\``);
			}

			let parsedData = JSON.parse(data as unknown as string);

			const level: number = Math.floor(parseInt(parsedData[message.author.id], 10) / 50);

			getExactLvl(level);

			function getExactLvl(lvl) {
				const levelEmbedMessage: Discord.MessageEmbed = new Discord.MessageEmbed()
					.setTitle(`${message.author.tag} level`)
					.setAuthor(message.author.username, message.author.avatarURL())
					.setDescription(`Your level - :gem: XP: **${parsedData[message.author.id]}** | :large_orange_diamond: Level: **${level}** `)
					.setColor("#019FE9")
					.setFooter(client.user.username, client.user.avatarURL())
					.setTimestamp()
				message.channel.send(levelEmbedMessage);

			}

		});
	}, 2000);

	message.channel.stopTyping();
}
