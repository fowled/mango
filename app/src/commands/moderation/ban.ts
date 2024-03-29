import Discord from "discord.js";

import { insertLog } from "utils/logChecker";
import { warn } from "utils/logger";

// Moderation command

/**
 * Bans a user.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "ban",
    description: "Bans a user",
    category: "moderation",
    botPermissions: ["BanMembers"],
    memberPermissions: ["BanMembers"],
    options: [
        {
            name: "user",
            type: 6,
            description: "The user you want to ban",
            required: true,
        },

        {
            name: "reason",
            type: 3,
            description: "The reason of the ban",
            required: false,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[]) {
        const memberBan = await interaction.guild.members.fetch(args[0]);
        const reason = args[1] ? args[1] : "no reason provided";

        if (memberBan) {
            const banMessageAuthor = interaction.user.tag;
            const banGuildName = interaction.guild.name;
            const guildIcon = interaction.guild.iconURL();
            const bannedUserId = memberBan.user.id;
            const date = new Date();

            const banMessageUser = new Discord.EmbedBuilder()
                .setTitle("Banned!")
                .setDescription(`You have been banned from the server **${banGuildName}** by *${banMessageAuthor}* on __${date.toLocaleString()}__! Reason: *"${reason}"*`)
                .setTimestamp()
                .setThumbnail(guildIcon)
                .setColor("#4292f4")
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.avatarURL(),
                });

            Client.users.cache.get(bannedUserId).send({ embeds: [banMessageUser] });

            setTimeout(() => {
                memberBan
                    .ban({
                        reason,
                    })
                    .then(async () => {
                        const banMessageGuild = new Discord.EmbedBuilder()
                            .setTitle(`User **${memberBan.user.username}** is now banned!`)
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.avatarURL(),
                            })
                            .setDescription(`<:yes:835565213498736650> **${memberBan.user.tag}** is now banned (*${reason}*)!`)
                            .setTimestamp()
                            .setColor("#4292f4")
                            .setFooter({
                                text: Client.user.username,
                                iconURL: Client.user.avatarURL(),
                            });

                        interaction.editReply({ embeds: [banMessageGuild] });

                        await insertLog(Client, interaction.guild.id, interaction.user, `**${memberBan.user.tag}** has been __banned__ by ${interaction.user.tag} for: *${reason}* \nDuration of the punishment: infinite`);
                    })
                    .catch(async (err: Error) => {
                        warn(err);
                    });
            }, 500);
        } else {
            interaction.editReply("Whodb, please select a member. Ban hammer is waiting!");
        }
    },
};
