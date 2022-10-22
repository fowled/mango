import Discord, { GuildMember } from 'discord.js';

import { timestamp } from 'utils/timestamp';

// Member command

/**
 * Shows some user information.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: 'userinfo',
    description: 'Get useful information from a user',
    category: 'info',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: "The user you'd like to get information from",
            required: false,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[]) {
        const selectedUser = args[0] ? await interaction.guild.members.fetch(args[0]) : (interaction.member as GuildMember);

        if (selectedUser) {
            const userinfoMessageEmbed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: selectedUser.user.username,
                    iconURL: selectedUser.user.avatarURL(),
                })
                .setThumbnail(selectedUser.user.avatarURL())
                .setTimestamp()
                .addFields(
                    { name: 'ID', value: `\`${selectedUser.user.id}\``, inline: true },
                    {
                        name: 'Game',
                        value: selectedUser.presence ? selectedUser.presence.activities.toString() : 'none',
                        inline: true,
                    },
                    {
                        name: 'Joined on',
                        value: timestamp(selectedUser.joinedAt.getTime()),
                        inline: true,
                    },
                    {
                        name: 'Created on',
                        value: timestamp(selectedUser.user.createdAt.getTime()),
                        inline: true,
                    },
                    {
                        name: 'Permissions',
                        value: selectedUser.permissions.toArray().length === 0 ? 'No permission' : `${selectedUser.permissions.toArray().length} permissions`,
                        inline: true,
                    },
                    {
                        name: 'Boosting',
                        value: selectedUser.premiumSince ? `<t:${Math.round(selectedUser.premiumSince.getTime() / 1000)}:d>` : 'No',
                        inline: true,
                    },
                    {
                        name: 'Roles',
                        value:
                            selectedUser.roles.cache.size === 1
                                ? 'No role'
                                : selectedUser.roles.cache
                                      .filter((role) => role.name !== '@everyone')
                                      .map((el) => el.name)
                                      .join(', '),
                        inline: false,
                    },
                )
                .setColor('Random')
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.avatarURL(),
                });

            interaction.editReply({ embeds: [userinfoMessageEmbed] });
        } else {
            interaction.editReply('Tagged user is not in the server :frowning:');
        }
    },
};
