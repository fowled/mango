import Discord from 'discord.js';

import { timestamp } from 'utils/timestamp';

// Member command

/**
 * Shows information about a server.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: 'servinfo',
    description: 'Get useful information from a server',
    category: 'info',

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction) {
        const guildPicture: string = interaction.guild.iconURL();

        let afkChannel: string;

        if (interaction.guild.afkChannel) {
            afkChannel = `#<${interaction.guild.afkChannel}>`;
        } else {
            afkChannel = 'None.';
        }

        const embed = new Discord.EmbedBuilder()
            .setThumbnail(guildPicture)
            .setAuthor({ name: `${interaction.guild.name}`, iconURL: guildPicture })
            .setColor('Random')
            .addFields(
                {
                    name: 'Channels',
                    value: `• Text: **${interaction.guild.channels.cache.filter((channel: Discord.TextChannel) => channel.type === Discord.ChannelType.GuildText).size}**
                    • Voice: **${interaction.guild.channels.cache.filter((channel: Discord.VoiceChannel) => channel.type === Discord.ChannelType.GuildVoice).size}**`,
                    inline: true,
                },
                {
                    name: 'Owner',
                    value: (await interaction.guild.fetchOwner()).user.tag,
                    inline: true,
                },
                {
                    name: 'Created on',
                    value: timestamp(interaction.guild.createdAt.getTime()),
                    inline: true,
                },
                {
                    name: 'Verification',
                    value: interaction.guild.verificationLevel.toString(),
                    inline: true,
                },
                {
                    name: 'Boosts',
                    value: interaction.guild.premiumSubscriptionCount.toString(),
                    inline: true,
                },
                {
                    name: 'Roles',
                    value: interaction.guild.roles.cache.size.toString(),
                    inline: true,
                },
                { name: 'AFK', value: afkChannel, inline: true },
            )
            .setFooter({
                text: Client.user.username,
                iconURL: Client.user.avatarURL(),
            })
            .setTimestamp();

        if (interaction.guild.banner) {
            embed.setImage(interaction.guild.bannerURL());
        }

        interaction.editReply({ embeds: [embed] });
    },
};
