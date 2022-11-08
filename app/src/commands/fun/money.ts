import Discord from "discord.js";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "interfaces/DB";

// Fun command

/**
 * Replies with your money
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "money",
    description: "Replies with your bank account's money",
    category: "fun",

    async execute(_Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, _args: string[], supabase: SupabaseClient<Database>) {
        const account = await supabase.from("users").select().eq("user_id", interaction.user.id).single();

        return await interaction.editReply({
            content: `:dollar: Your account currently has **${account.data.money}$**!`,
        });
    },
};