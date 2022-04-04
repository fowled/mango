import * as Discord from "discord.js";
import { clientInteractions } from "../../index";

// Help command

/**
 * Answers with the infohelp message in dm.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
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
			required: false,
		},
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
		if (args[0]) {
			const command: any = clientInteractions.get(args[0]);

			if (!command) {
				return interaction.editReply("<:no:835565213322575963> I couldn't find the command you requested. Please check the correct command name with `/help`");
			}

			const infoEmbed: Discord.MessageEmbed = new Discord.MessageEmbed().setAuthor(interaction.member.user.username, interaction.member.user.displayAvatarURL()).setDescription(`Information about the **${command.name}** command`).addField("Category", command.category, false).addField("Description", command.description, false).setColor("RANDOM").setTimestamp().setFooter(Client.user.username, Client.user.displayAvatarURL());

			const options: string[] = [],
				usage: string[] = [];

			if (command && command.options) {
				for (const [index, opt] of command.options.entries()) {
					options.push(`${index + 1}. <${opt.name}> - ${opt.description} - ${opt.required ? "required" : "not required"}`);
					usage.push(`<${opt.name}>`);
				}

				infoEmbed.addField("Args", "```md\n" + options.join("\n") + "```", false);
				infoEmbed.addField("Usage", `\`/${command.name} ${usage.join(" ")}\``);
			}

			interaction.editReply({ embeds: [infoEmbed] });
		} else {
			const helpinteraction: Discord.MessageEmbed = new Discord.MessageEmbed()
				.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
				.setColor("RANDOM")
				.setDescription(`» Prefix: \`/\` \n» To get help on a specific command: \`/help [command]\` \n\n**:tools: Moderation** \n${GetCategoryCmds("moderation")} \n\n**:partying_face: Fun** \n${GetCategoryCmds("fun")} \n\n**:information_source: Information** \n${GetCategoryCmds("info")} \n\n**:computer: APIs** \n${GetCategoryCmds("api")} \n\n**:video_game: Games** \n${GetCategoryCmds("game")} \n\n» Number of commands: \`${clientInteractions.size}\` \n» Mango's developer: \`${(await Client.users.fetch("352158391038377984")).tag}\``)
				.setThumbnail(Client.user.avatarURL())
				.setFooter(Client.user.username, Client.user.avatarURL())
				.setTimestamp();

			interaction.editReply({ embeds: [helpinteraction] });
		}

		function GetCategoryCmds(category: string) {
			return clientInteractions
				.filter((cmd: any) => cmd.category === category)
				.map((cmd) => `\`${cmd.name}\``)
				.join(", ");
		}
	},
};
