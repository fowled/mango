import * as Discord from "discord.js";
import * as Logger from "../../utils/Logger";
import * as LogChecker from "../../utils/LogChecker";

// Mod command

/**
 * Locks a channel
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "unlockchannel",
    description: "Unlocks a channel",
    category: "moderation",
    botPermissions: ["MANAGE_CHANNELS"],
    memberPermissions: ["MANAGE_CHANNELS"],
    options: [
        {
            name: "role",
            type: "MENTIONABLE",
            description: "The role you want to unlock the channel to",
            required: true
        },

        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel that will be unlocked",
            required: false
        }
    ],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
        const role: Discord.Role = await interaction.guild.roles.fetch(args[0]);
        const messageChannel = !args[1] ? interaction.channel as Discord.GuildChannel : await interaction.guild.channels.fetch(args[1]);

        if (!role) {
            return interaction.editReply("I didn't find the role you specified. <:no:835565213322575963>");
        }

        messageChannel.permissionOverwrites.create(role, {
            "SEND_MESSAGES": true,
        }).then(() => {
            interaction.editReply(`<:yes:835565213498736650> ${messageChannel} has been unlocked for ${role}.`)
        }).catch(err => {
            Logger.error(err);
            interaction.editReply("An error occured. <:no:835565213322575963> ```\n" + err + "```");
        });

        // @ts-ignore
        LogChecker.insertLog(Client, interaction.guild.id, interaction.member.user, `**${interaction.channel}** (\`${interaction.channel.name}\`) has been unlocked by *${interaction.member.user.tag}*`);
    }
}
