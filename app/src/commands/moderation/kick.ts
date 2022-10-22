import Discord from 'discord.js';

import { insertLog } from 'utils/logChecker';

// Moderation command

/**
 * Kicks user.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: 'kick',
    description: 'Kicks a user',
    category: 'moderation',
    botPermissions: ['KickMembers'],
    memberPermissions: ['KickMembers'],
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user you want to kick',
            required: true,
        },

        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason of the kick',
            required: false,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[]) {
        const memberKick = await interaction.guild.members.fetch(args[0]);
        const reason = args[1] ? args[1] : 'no reason provided';

        if (memberKick) {
            const kickMessageAuthor = interaction.user.username;
            const kickGuildName = interaction.guild.name;
            const guildIcon = interaction.guild.iconURL();
            const date = new Date();

            const kickMessageUser = new Discord.EmbedBuilder()
                .setTitle('Kicked!')
                .setDescription(`You have been kicked from the server **${kickGuildName}** by *${kickMessageAuthor}* on date __${date.toLocaleDateString()}__! Reason: *"${reason}"*`)
                .setTimestamp()
                .setThumbnail(guildIcon)
                .setColor('#4292f4')
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.avatarURL(),
                });

            memberKick.send({ embeds: [kickMessageUser] });

            setTimeout(async () => {
                await memberKick
                    .kick(reason)
                    .then(async () => {
                        const kickMessageGuild = new Discord.EmbedBuilder()
                            .setTitle(`User ${memberKick.user.username} has been kicked from the guild!`)
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.avatarURL(),
                            })
                            .setDescription(`<:yes:835565213498736650> **${memberKick.user.tag}** is now kicked (*${reason}*)!`)
                            .setTimestamp()
                            .setColor('#4292f4')
                            .setFooter({
                                text: Client.user.username,
                                iconURL: Client.user.avatarURL(),
                            });

                        interaction.editReply({ embeds: [kickMessageGuild] });

                        await insertLog(Client, interaction.guild.id, interaction.user, `**${memberKick.user.tag}** has been __kicked__ by ${interaction.user.tag} for: *${reason}* \nDuration of the punishment: infinite`);
                    })
                    .catch(() => {
                        const kickMessageError = new Discord.EmbedBuilder()
                            .setTitle('Error')
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.avatarURL(),
                            })
                            .setDescription(`An error has occured while kicking **${memberKick.user.tag}**; missing permissions. Make sure I have admin perms, then I promise I'll take the hammer!`)
                            .setTimestamp()
                            .setColor('#FF0000')
                            .setFooter({
                                text: Client.user.username,
                                iconURL: Client.user.avatarURL(),
                            });

                        interaction.editReply({ embeds: [kickMessageError] });
                    });
            }, 750);
        } else {
            interaction.editReply("Boop! A super rare unknown error has occured. Maybe the user you tried to kick isn't in the server...?");
        }
    },
};
