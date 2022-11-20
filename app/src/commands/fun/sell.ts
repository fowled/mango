import Discord from "discord.js";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "interfaces/DB";

// Fun command

/**
 * Sells something to the black market (lmfao)
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "sell",
    description: "Sells an object to Mango's marketplace",
    category: "fun",
    options: [
        {
            name: "price",
            type: 3,
            description: "The item's price",
            required: true,
        },

        {
            name: "item",
            type: 3,
            description: "The item's name",
            required: true,
        },
    ],

    async execute(_Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[], supabase: SupabaseClient<Database>) {
        const item = args.slice(1, args.length).join(" ");
        const price = parseInt(args[0]);

        const sellerAccount = await supabase.from("users").select().like("user_id", interaction.user.id).single();

        if (isNaN(price)) {
            return interaction.editReply(`The price you specified isn't a number. Please retry and remove every symbol of the price, eg: \`240$\` → \`240\``);
        } else if (item.includes("@") || price.toString().startsWith("-")) {
            return interaction.editReply("I can't add this item to the market because it contains a mention, or you set a negative price.");
        } else if (!sellerAccount) {
            return interaction.editReply("It looks like you haven't created your account! Do `/money` first :wink:");
        } else if (item.length > 70) {
            return interaction.editReply("Your item name is too long!");
        }

        const getMoney = sellerAccount.data.money;

        const findSimilarItems = await supabase.from("market").select("name").like("name", item).eq("sold", false);

        if (findSimilarItems.data.length > 0) {
            return interaction.editReply("Looks like an item already has that name. Please try another one.");
        }

        if (getMoney < price) {
            return interaction.editReply(`You can't sell this item at **${price}** because you only have **${getMoney}**$.`);
        }

        const createdItem = await supabase.from("market").insert({
            name: item,
            price,
            sellerID: interaction.user.id,
        }).select();

        await interaction.editReply(`The item \`${item}\` with price \`${price}\`$ was succesfully added to the market. ID of your item: **${createdItem.data.shift().id}** <:yes:835565213498736650>`);
    },
};
