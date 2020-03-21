import * as Discord from "discord.js";
import * as FS from "fs";

// Preferences/settings command

/**
 * Shows user preferences/settings.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	if (!args[0]) {
		return message.channel.send("Preferences... what? !preferences prefix see`, `!preferences prefix set [prefix]`, `!preferences language set [En, Fr]`"); // menu des préférences
	}

	if (args[0] === "prefix" && args[1] === "set") {
		if (args[2].length > 1) {
			message.reply("Prefix length cannot be longer than 1 character. Please retry.");
		} else {
			FS.writeFileSync(`custom/prefixes/${message.author.id}.txt`, args[2]);
			message.reply(`Your prefix has been edited : \`${args[2]}\``);
		}

	} else if (args[0] === "prefix" && args[1] === "see") {
		FS.readFile(`custom/prefixes/${message.author.id}.txt`, (err, data) => {
			if (!data) {
				message.reply("You have the default prefix - change it by entering `!preferences prefix set [prefix]`");
			} else {
				message.reply(`Your prefix: \`${data}\``);
			}

		});


	} else {
		message.reply("Somehow my brain didn't understand your command... Please retry!");
	}
}
