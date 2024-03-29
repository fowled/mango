import Discord from "discord.js";

import type { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "../../interfaces/DB";

// Fun command

/**
 * Shows your inventory w/ market
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "inventory",
    description: "Shows your inventory",
    category: "fun",
    botPermissions: ["AddReactions"],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, _args: string[], supabase: SupabaseClient<Database>) {
        let inventory: Database["public"]["Tables"]["market"]["Row"][];

        let page = 0,
            replyId: string;

        await assignData();

        if (!inventory.length) {
            return interaction.editReply("Your inventory is empty! Start by doing `/market` and then buy something with the `/buy [ID of the item]` command.");
        }

        await getPageContent();

        await createReactionCollector();

        async function assignData() {
            let getInventoryItems = await supabase.from("users").select("inventory").like("user_id", interaction.user.id).single();

            let query = await supabase.from("market").select().in("id", getInventoryItems.data.inventory).eq("sold", true);

            return inventory = query.data;
        }

        async function getPageContent() {
            const itemsContent = inventory.slice(page * 10, page * 10 + 10);
            const pageContent: string[] = ["```ansi"];

            for (const [index, item] of itemsContent.entries()) {
                const itemName = item.name;
                const itemPrice = item.price;
                const itemSeller = item.sellerID;
                const user = await Client.users.fetch(itemSeller);

                pageContent.push(`\u001b[1;34m${index + (page * 10 + 1)}.\u001b[1;35m ${itemName}\u001b[0;30m (\u001b[1;36m${itemPrice}$\u001b[0;30m)\u001b[0m ←\u001b[1;33m ${user.username}\u001b[0;30m#${user.discriminator}`);
            }

            pageContent.push("```");

            const inventoryEmbed = new Discord.EmbedBuilder().setDescription(pageContent.join("\n")).setColor("#33beff").setTitle("🛒 Inventory").setTimestamp().setFooter({
                text: Client.user.username,
                iconURL: Client.user.displayAvatarURL(),
            });

            const button = new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("back")
                    .setLabel("◀")
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setDisabled(page === 0),

                new Discord.ButtonBuilder().setCustomId("next").setLabel("▶").setStyle(Discord.ButtonStyle.Primary).setDisabled(buttonChecker()),

                new Discord.ButtonBuilder().setCustomId("refresh").setLabel("🔄").setStyle(Discord.ButtonStyle.Success),
            );

            if (replyId) {
                return interaction.channel.messages.fetch(replyId).then((msg) =>
                    msg.edit({
                        embeds: [inventoryEmbed],
                        components: [button],
                    }),
                );
            } else {
                await interaction.editReply({
                    embeds: [inventoryEmbed],
                    components: [button],
                });

                replyId = await interaction.fetchReply().then((msg) => msg.id);
            }
        }

        function buttonChecker() {
            const index = page + 1;

            return inventory.slice(index * 10, index * 10 + 10).length === 0;
        }

        async function createReactionCollector() {
            interaction.fetchReply().then((msg: Discord.Message) => {
                const collector = msg.createMessageComponentCollector({
                    componentType: Discord.ComponentType.Button,
                });

                collector.on("collect", async (i) => {
                    if (i.customId === "back") {
                        page--;
                    } else if (i.customId === "next") {
                        page++;
                    }

                    await assignData();

                    await getPageContent();
                });

                collector.on("end", () => {
                    return;
                });
            });
        }
    },
};
