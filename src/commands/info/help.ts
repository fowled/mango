import * as Discord from "discord.js";
import * as Fs from "fs";
import * as Logger from "../../utils/Logger";

// Help command

/**
 * Answers with the infohelp message in dm.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
	let moderationcmd: string[] = [], funcmd: string[] = [], musiccmd: string[] = [], infocmd: string[] = [], gamecmd: string[] = [];

	if (args[0]) {
		const info = require(checkFolders(args[0])).info;
		const infoEmbed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setDescription(`Information about the **${args[0]}** command`)
			.addField("Category", info.category, false)
			.addField("Description", info.description, false)
			.addField("Args", info.args, false)
			.setColor("RANDOM")
			.setTimestamp()
			.setFooter(Client.user.username, Client.user.displayAvatarURL())

		message.channel.send(infoEmbed);
	} else {
		checkCommands();

		const helpMessage: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.avatarURL())
			.setColor("RANDOM")
			.setDescription(`» Prefix: \`@ the bot\` \n» To get help on a specific command: \`ma!help [command]\` \n\n**:tools: Moderation** \n${moderationcmd.join(", ")} \n\n**:partying_face: Fun** \n${funcmd.join(", ")} \n\n**:information_source: Information** \n${infocmd.join(", ")} \n\n**:video_game: Games** \n${gamecmd.join(", ")} \n\n**:musical_note: Music** \n${musiccmd.join(", ")} \n\n» Mango's developer: \`Mazz#3605\``)
			.setThumbnail(Client.user.avatarURL())
			.setFooter(Client.user.username, Client.user.avatarURL())
			.setTimestamp();

		message.channel.send(helpMessage);
	}

	function checkFolders(command) {
		let folders = ["moderation", "fun", "music", "info", "game"];
		var files: string[];
		var finalPath: string;

		folders.forEach(folder => {
			files = Fs.readdirSync(`./src/commands/${folder}`);

			files.forEach(file => {
				if (file.split(".")[0] == command) {
					return finalPath = `../../commands/${folder}/${file.split(".")[0]}.js`;
				}
			});
		});

		return finalPath;
	}

	function checkCommands() {
		let folders = ["moderation", "fun", "music", "info", "game"];
		var files: string[];
		var commands: string[] = [];

		folders.forEach(folder => {
			files = Fs.readdirSync(`./src/commands/${folder}`);

			files.forEach(file => {
				getVar(folder).push(`\`${file.split(".")[0]}\``);
			});
		});

		return commands;
	}

	function getVar(folderName: string) {
		switch (folderName) {
			case "moderation":
				return moderationcmd;

			case "fun":
				return funcmd;

			case "music":
				return musiccmd;

			case "info":
				return infocmd;

			case "game":
				return gamecmd;

			default:
				return null;
		}
	}
}

const info = {
    name: "help",
    description: "Seriously, what did you expect...?",
    category: "info",
    args: "none"
}

export { info };
