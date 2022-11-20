import Discord from "discord.js";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "interfaces/DB";

// Fun command

/**
 * Buys something on the black market (lmfao)
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "buy",
    description: "Buy something of the market",
    category: "fun",
    options: [
        {
            name: "id",
            type: 3,
            description: "The ID of the item you want to buy",
            required: true,
        },
    ],

    async execute(_Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[], supabase: SupabaseClient<Database>) {
        const ID = args[0];

        const item = await supabase.from("market").select().eq("id", ID).single();

        if (!item) {
            return interaction.editReply(`I'm sorry, but there is no item matching ID **${args[0]}**. To consult the market, do \`/market\` :wink:`);
        }

        const authorMoney = await supabase.from("users").select().like("user_id", interaction.user.id).single();
        const sellerMoney = await supabase.from("users").select().like("user_id", item.data.sellerID).single();

        if (authorMoney.data.money < item.data.price) {
            return interaction.editReply(`You must have \`${item.data.price - authorMoney.data.money}\` more dollars to get this item. :frowning:`);
        } else if (interaction.user.id === item.data.sellerID) {
            return interaction.editReply("You can't buy your own item...");
        }


        await Promise.all(
            [
                await supabase.from("users").update({ inventory: [...authorMoney.data.inventory, item.data.id] }).like("user_id", interaction.user.id),
                await supabase.from("users").update({ money: authorMoney.data.money - item.data.price }).like("user_id", interaction.user.id),
                await supabase.from("users").update({ money: sellerMoney.data.money + item.data.price }).like("user_id", sellerMoney.data.user_id),
                await supabase.from("market").update({ sold: true }).eq("id", item.data.id),
                await interaction.editReply(`Item **${item.data.name}** successfully bought for *${item.data.price}$*.`),
            ],
        );
    },
};
