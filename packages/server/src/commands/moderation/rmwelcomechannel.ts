import Discord from "discord.js";

import type {PrismaClient} from "@prisma/client";

// Fun command

/**
 * Saves the ID of the channel you want logs in.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "rmwelcomechannel",
    description: "Removes the guild's welcome channel for Mango",
    category: "moderation",
    memberPermissions: ["MANAGE_CHANNELS"],

    async execute(_Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, _args: string[], prisma: PrismaClient) {
        const welcomechannel = await prisma.welChannels.findUnique({where: {idOfGuild: interaction.guild.id}});

        if (welcomechannel) {
            await prisma.welChannels.delete({where: {idOfGuild: interaction.guild.id}});
        } else {
            return interaction.editReply("I'm sorry, but you don't have any log channel for the moment. Get started by doing `/setwelcomechannel [channel]`!");
        }

        return interaction.editReply(
            "<:yes:835565213498736650> Successfully removed the welcome channel! You won't receive welcome notifications anymore. Was that a mistake? Do `/setwelcomechannel (#channel)` to add it back."
        );
    },
};
