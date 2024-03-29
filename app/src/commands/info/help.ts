import Discord from "discord.js";

import { clientInteractions } from "index";

// Help command

/**
 * Answers with the infohelp message in dm.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
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
            type: 3,
            description: "Get precise help on a specified command",
            required: false,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[]) {
        if (args[0]) {
            const command = clientInteractions.get(args[0]);

            if (!command) {
                return interaction.editReply("<:no:835565213322575963> I couldn't find the command you requested. Please check the correct command name with `/help`");
            }

            const infoEmbed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setDescription(`Information about the **${command.name}** command`)
                .addFields({ name: "Category", value: command.category }, { name: "Description", value: command.description })
                .setColor("Random")
                .setTimestamp()
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.displayAvatarURL(),
                });

            const options: string[] = [],
                usage: string[] = [];

            if (command && command.options) {
                for (const [index, opt] of command.options.entries()) {
                    options.push(`${index + 1}. <${opt.name}> - ${opt.description} - ${opt.required ? "required" : "not required"}`);
                    usage.push(`<${opt.name}>`);
                }

                infoEmbed.addFields({ name: "Args", value: "```md\n" + options.join("\n") + "```" }, { name: "Usage", value: `\`/${command.name} ${usage.join(" ")}\`` });
            }

            interaction.editReply({ embeds: [infoEmbed] });
        } else {
            const helpinteraction = new Discord.EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL(),
                })
                .setColor("Random")
                .setDescription(
                    `» Prefix: \`/\`
					» To get help on a specific command: \`/help [command]\` 
					
					**:tools: Moderation** 
					${GetCategoryCmds("moderation")}

					**:partying_face: Fun** 
					${GetCategoryCmds("fun")}

					**:information_source: Information** 
					${GetCategoryCmds("info")}

					**:video_game: Games** 
					${GetCategoryCmds("game")}
					
					» Number of commands: \`${clientInteractions.size}\`
					» Mango's developer: \`${(await Client.users.fetch("352158391038377984")).tag}\``,
                )
                .setThumbnail(Client.user.avatarURL())
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.avatarURL(),
                })
                .setTimestamp();

            interaction.editReply({ embeds: [helpinteraction] });
        }

        function GetCategoryCmds(category: string) {
            return clientInteractions
                .filter((cmd) => cmd.category === category)
                .map((cmd) => `\`${cmd.name}\``)
                .join(", ");
        }
    },
};
