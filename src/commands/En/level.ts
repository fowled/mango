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
		FS.readFile(`ranks/${message.author.id}.txt`, (err, data) => {

			const level: number = Math.floor(parseInt(data.toString(), 10) / 50);

			getExactLvl(level);

			function getExactLvl(lvl) {
				const finalLvl: any = lvl.split(".")[0];

				const levelEmbedMessage: Discord.RichEmbed = new Discord.RichEmbed()
					.setTitle(`${message.author.tag} level`)
					.setAuthor(message.author.username, message.author.avatarURL)
					.setDescription(`Your level - :gem: XP: **${data}** | :large_orange_diamond: Level: **${finalLvl}** `)
					.setColor("#019FE9")
					.setFooter(client.user.username, client.user.avatarURL)
					.setTimestamp()
				message.channel.send(levelEmbedMessage);

			}

		});
	}, 2000);

	message.channel.stopTyping();
}
