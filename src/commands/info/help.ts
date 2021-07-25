// @ts-nocheck
import * as Discord from "discord.js";

// Help command

/**
 * Answers with the infohelp message in dm.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "help",
	description: "Showcasing all of Mango's commands",
	category: "info",
	options: [
		{
			name: "command",
			type: "STRING",
			description: "Get precise help on a specified command",
			required: false
		}
	],

	async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
		if (args[0]) {
			let command = Client.commands.get(args[0]);

			if (!command) {
				return message.reply("<:no:835565213322575963> I couldn't find the command you requested. Please check the correct command name with `ma!help`");
			}
			
			const infoEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setAuthor(message.member.user.username, message.member.user.displayAvatarURL())
			.setDescription(`Information about the **${command.name}** command`)
			.addField("Category", command.category, false)
			.addField("Description", command.description, false)
			.setColor("RANDOM")
			.setTimestamp()
			.setFooter(Client.user.username, Client.user.displayAvatarURL())
			
			let options: string[] = [], usage: string[] = [];
			
			if (command && command.options) {
				for (const [index, opt] of command.options.entries()) {
					options.push(`${index + 1}. <${opt.name}> - ${opt.description} - ${opt.required ? "required" : "not required"}`);
					usage.push(`<${opt.name}>`);
				}

				infoEmbed.addField("Args", "```md\n" + options.join("\n") + "```", false);
				infoEmbed.addField("Usage", `\`ma!${command.name} ${usage.join(" ")}\``);
			}

			message.reply({ embeds: [infoEmbed] });
		} else {
			const helpMessage: Discord.MessageEmbed = new Discord.MessageEmbed()
				.setAuthor(message.member.user.username, message.member.user.avatarURL())
				.setColor("RANDOM")
				.setDescription(`» Prefix: \`ma!\` \n» To get help on a specific command: \`ma!help [command]\` \n\n**:tools: Moderation** \n${GetCategoryCmds("moderation")} \n\n**:partying_face: Fun** \n${GetCategoryCmds("fun")} \n\n**:information_source: Information** \n${GetCategoryCmds("info")} \n\n**:video_game: Games** \n${GetCategoryCmds("game")} \n\n» Mango's developer: \`${(await Client.users.fetch("352158391038377984")).tag}\``)
				.setThumbnail(Client.user.avatarURL())
				.setFooter(Client.user.username, Client.user.avatarURL())
				.setTimestamp();

			message.reply({ embeds: [helpMessage] });
		}

		function GetCategoryCmds(category: string) {
			return Client.commands.filter(cmd => cmd.category === category).map(cmd => `\`${cmd.name}\``).join(", ");
		}
	}
}
