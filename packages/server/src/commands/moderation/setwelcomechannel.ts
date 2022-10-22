import Discord from 'discord.js';

import type { PrismaClient } from '@prisma/client';

// Fun command

/**
 * Saves the ID of the channel you want welcome messages in.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: 'setwelcomechannel',
    description: "Sets guild's welcome channel for Mango",
    category: 'moderation',
    memberPermissions: ['ManageChannels'],
    options: [
        {
            name: 'channel',
            type: 'CHANNEL',
            description: 'The channel you want to set welcome channels to',
            required: false,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[], prisma: PrismaClient) {
        const welcomeChannelID = args[0] ? args[0].replace(/\D+/g, '') : interaction.channel.id;
        const fetchChannel = (await Client.channels.fetch(welcomeChannelID)) as Discord.TextChannel;

        if (fetchChannel.type !== Discord.ChannelType.GuildText) {
            return interaction.editReply("The channel you specified isn't a text channel. Please retry the command.");
        }

        const welcomechannel = await prisma.welChannels.findUnique({
            where: { idOfGuild: interaction.guild.id },
        });

        if (welcomechannel) {
            await prisma.welChannels.update({
                where: { idOfGuild: interaction.guild.id },
                data: { idOfChannel: welcomeChannelID },
            });
        } else {
            await prisma.welChannels.create({
                data: {
                    idOfGuild: welcomeChannelID,
                    idOfChannel: interaction.channel.id,
                },
            });
        }

        return interaction.editReply(`<:yes:835565213498736650> Successfully updated the welcome channel to \`#${fetchChannel.name}\`!`);
    },
};
