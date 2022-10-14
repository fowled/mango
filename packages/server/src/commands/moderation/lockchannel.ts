import Discord from "discord.js";

import {error} from "utils/logger";
import {insertLog} from "utils/logChecker";

// Mod command

/**
 * Locks a channel
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "lockchannel",
    description: "Locks a channel",
    category: "moderation",
    botPermissions: ["ManageChannels"],
    memberPermissions: ["ManageChannels"],
    options: [
        {
            name: "role",
            type: "MENTIONABLE",
            description: "The role you want to lock the channel to",
            required: true,
        },

        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel that will be locked",
            required: false,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[]) {
        const role = await interaction.guild.roles.fetch(args[0]);
        const messageChannel = !args[1] ? (interaction.channel as Discord.GuildChannel) : await interaction.guild.channels.fetch(args[1]) as Discord.GuildChannel;

        if (!role) {
            return interaction.editReply("I didn't find the role you specified. <:no:835565213322575963>");
        }

        messageChannel.permissionOverwrites
            .create(role, {
                "SendMessages": false,
            })
            .then(() => {
                interaction.editReply(`<:yes:835565213498736650> ${messageChannel} has been locked for ${role}.`);
            })
            .catch((err) => {
                error(err);

                interaction.editReply("An error occured. <:no:835565213322575963> ```\n" + err + "```");
            });

        await insertLog(Client, interaction.guild.id, interaction.user, `**${interaction.channel}** (\`${(interaction.channel as Discord.TextChannel).name}\`) has been locked by *${interaction.user.tag}*`);
    },
};
