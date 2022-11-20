import Discord from "discord.js";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "interfaces/DB";

// Fun command

/**
 * Saves the ID of the channel you want welcome messages in.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "setwelcomechannel",
    description: "Sets guild's welcome channel for Mango",
    category: "moderation",
    memberPermissions: ["ManageChannels"],
    options: [
        {
            name: "channel",
            type: 7,
            description: "The channel you want to set welcome channels to",
            required: false,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[], supabase: SupabaseClient<Database>) {
        const welcomeChannelID = args[0] ? args[0].replace(/\D+/g, "") : interaction.channel.id;
        const fetchChannel = (await Client.channels.fetch(welcomeChannelID)) as Discord.TextChannel;

        if (fetchChannel.type !== Discord.ChannelType.GuildText) {
            return interaction.editReply("The channel you specified isn't a text channel. Please retry the command.");
        }

        await supabase.from("guilds").update({ welcome: welcomeChannelID }).like("guild_id", interaction.guild.id);

        return interaction.editReply(`<:yes:835565213498736650> Successfully updated the welcome channel to \`#${fetchChannel.name}\`!`);
    },
};
