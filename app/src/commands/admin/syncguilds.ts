import Discord from "discord.js";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "interfaces/DB";

import { warn } from "utils/logger";

// Fun command

/**
 * Birthday module!
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "syncguild",
    description: "[admin] Sync mutual guilds between the bot and a user",
    category: "admin",
    options: [
        {
            name: "userid",
            type: 3,
            description: "The channel you want to set logs to",
            required: false,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, _args: string[], supabase: SupabaseClient<Database>) {
        if (interaction.user.id !== process.env.ADMIN_ID) {
            return interaction.reply("This command is admin-only.");
        }

        const userId = interaction.options.getString("userid");
        const fetchUserFromDB = await supabase.from("users").select().like("user_id", userId).single();

        if (!fetchUserFromDB.data) {
            return interaction.editReply("Couldn't fetch this user from the database.");
        }

        const mutualGuildsIds = [];

        await Promise.all(Client.guilds.cache.map(async (g) => {
            try {
                await g.members.fetch({ user: userId });

                mutualGuildsIds.push(g.id);
            } catch { };
        }));

        await supabase.from("users").update({ guilds: [...mutualGuildsIds] }).like("user_id", userId);

        return interaction.editReply("Done fetching mutual guilds.");
    }
}
