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
		return message.channel.send("Preferences... what? !preferences prefix see`, `!preferences prefix set [prefix]`");
	}

	if (args[0] === "prefix" && args[1] === "set") {
		if (args[2].length > 1) {
			message.reply("Prefix length cannot be longer than 1 character. Please retry.");
		} else {
			let data = JSON.parse(FS.readFileSync(`./database/prefixes/prefixes.json`, "utf8"));
			data[message.author.id] = args[2];
			FS.writeFileSync(`database/prefixes/prefixes.json`, JSON.stringify(data));
			message.reply(`Your prefix has been edited : \`${args[2]}\``);
		}

	} else if (args[0] === "prefix" && args[1] === "see") {
		FS.readFile(`database/prefixes/prefixes.json`, (err, data) => {
			data = JSON.parse(data as unknown as string);
			if (data[message.author.id] == undefined) {
				message.reply("You have the default prefix - change it by entering `!preferences prefix set [prefix]`");
			} else {
				message.reply(`Your prefix: \`${data[message.author.id]}\``);
			}

		});

	} else {
		message.reply("Somehow my brain didn't understand your command... Please retry!");
	}
}
