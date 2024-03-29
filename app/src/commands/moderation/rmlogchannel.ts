import Discord from "discord.js";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "interfaces/DB";

// Fun command

/**
 * Saves the ID of the channel you want logs in.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "rmlogchannel",
    description: "Removes the guild's log channel for Mango",
    category: "moderation",
    memberPermissions: ["ManageChannels"],

    async execute(_Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, _args: string[], supabase: SupabaseClient<Database>) {
        const logchannel = await supabase.from("guilds").select().like("guild_id", interaction.guild.id).single();

        if (logchannel.data?.logs) {
            await supabase.from("guilds").update({ logs: null }).like("guild_id", interaction.guild.id);
        } else {
            return interaction.editReply("I'm sorry, but you don't have any log channel for the moment. Get started by doing `/setlogchannel [channel]`!");
        }

        return interaction.editReply("<:yes:835565213498736650> Successfully removed the log channel! You won't receive log notifications anymore. Was that a mistake? Do `/setlogchannel (#channel)` to add it back.");
    },
};
