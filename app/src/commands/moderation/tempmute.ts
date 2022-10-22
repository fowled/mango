import Discord from "discord.js";
import ms from "ms";

import { insertLog } from "utils/logChecker";

// Moderation command

/**
 * Mutes a user
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "tempmute",
    description: "Temporarily mutes a user",
    category: "moderation",
    botPermissions: ["ManageRoles"],
    memberPermissions: ["ManageRoles", "ManageMessages"],
    options: [
        {
            name: "user",
            type: "USER",
            description: "The user I have to mute",
            required: true,
        },

        {
            name: "duration",
            type: "STRING",
            description: "The mute duration",
            required: true,
        },

        {
            name: "reason",
            type: "STRING",
            description: "The reason of the mute",
            required: false,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[]) {
        const memberMute = await interaction.guild.members.fetch(args[0]);

        if (!memberMute) {
            return interaction.editReply("You specified an invalid user to mute. Please tag him in order to mute them.");
        }

        let muteRole = interaction.guild.roles.cache.find((role) => role.name === "muted");

        if (!muteRole) {
            try {
                muteRole = await interaction.guild.roles.create({
                    name: "muted",
                    mentionable: false,
                    permissions: [],
                    color: "#524F4F",
                });

                for (let i = 0; i < interaction.guild.channels.cache.size; i++) {
                    const channel: Discord.GuildChannel = interaction.guild.channels.cache[i];

                    await channel.permissionOverwrites.edit(muteRole, {
                        SendMessages: false,
                        AddReactions: false,
                    });
                }
            } catch (error) {
                interaction.editReply("Sorry, but I got an unexcepted error while creating the role. " + `\`\`\`${error.message}\`\`\``);
            }
        }

        const mutetime = args[1];

        if (!ms(mutetime)) {
            return interaction.editReply("This isn't a correct duration time. Please retry with a valid one.");
        }

        const reason = args[2] === undefined ? "no reason specified." : interaction.type === Discord.InteractionType.ApplicationCommand ? args[2] : args.slice(1, args.length).join(" ");

        await memberMute.roles.add(muteRole).catch(() => {
            return interaction.editReply("Looks like I'm missing permissions. Check them in the server settings.");
        });

        interaction.editReply(`**${memberMute.user.tag}** has been muted for *${ms(ms(mutetime))}*. <:yes:835565213498736650>`);

        await insertLog(Client, interaction.guild.id, interaction.user, `**${memberMute.user.tag}** has been __tempmuted__ by ${interaction.user.tag} for: *${reason}* \nDuration of the punishment: ${ms(ms(mutetime))}`);

        setTimeout(async function () {
            memberMute.roles.remove(muteRole);
        }, ms(mutetime));
    },
};
