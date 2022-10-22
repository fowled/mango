import Discord from 'discord.js';

import { clientInteractions, prisma } from 'index';

import { logCommand } from 'utils/sendLog';
import { error } from 'utils/logger';

module.exports = {
    name: 'interactionCreate',
    async execute(Client: Discord.Client, interaction: Discord.BaseInteraction) {
        if (interaction.isButton()) {
            return await interaction.deferUpdate();
        }

        if (!interaction.isChatInputCommand()) return;

        const args = interaction.options.data.filter((data) => data.type !== Discord.ApplicationCommandOptionType.Subcommand).map((opt) => opt.value.toString());
        const command = interaction.commandName;

        if (!interaction.isCommand() && !clientInteractions.has(command)) return;

        const commandInteraction = clientInteractions.get(command);
        const interactionMember = interaction.member as Discord.GuildMember;

        if (commandInteraction.memberPermissions && !interactionMember.permissions.has(commandInteraction.memberPermissions as Discord.PermissionResolvable)) {
            return interaction.reply({
                content: `<:no:835565213322575963> Sorry, but it looks like you're missing one of the following permissions: \`${commandInteraction.memberPermissions.join(', ')}\``,
                ephemeral: true,
            });
        } else if (commandInteraction.botPermissions && !(await interaction.guild.members.fetchMe()).permissions.has(commandInteraction.botPermissions as Discord.PermissionResolvable)) {
            return interaction.reply({
                content: `<:no:835565213322575963> It looks like I'm missing one of the following permissions: \`${commandInteraction.botPermissions.join(', ')}\``,
                ephemeral: true,
            });
        }

        await interaction.deferReply();

        try {
            commandInteraction.execute(Client, interaction, args, prisma);
        } catch (err) {
            error(err);
        }

        const commandEmbed = new Discord.EmbedBuilder()
            .setDescription(`**${interaction.user.tag}** just ran the \`${interaction.commandName}\` command in *${interaction.guild.name}*.`)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setColor('NotQuiteBlack')
            .setTimestamp()
            .setFooter({
                text: Client.user.username,
                iconURL: Client.user.displayAvatarURL(),
            });

        logCommand(Client, commandEmbed);
    },
};
