import Discord from "discord.js";
import moment from "moment";

import type { SupabaseClient, PostgrestResponse } from "@supabase/supabase-js";

import type { Database } from "interfaces/DB";

// Fun command

/**
 * Birthday module!
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "birthdays",
    description: "Lists all the guild birthdays",
    category: "fun",
    subcommands: [
        {
            name: "list",
            description: "Lists all birthdays",
            type: 1,
        },
        {
            name: "upcoming",
            description: "Lists upcoming birthdays",
            type: 1,
        },
    ],
    botPermissions: ["AddReactions"],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, _args: string[], supabase: SupabaseClient<Database>) {
        let birthdays: Database["public"]["Tables"]["users"]["Row"][];

        let page = 0,
            replyId: string;

        await assignData();

        if (!birthdays?.length) {
            return interaction.editReply("It seems like the birthday list is empty! You may want to `/birthday add` one.");
        }

        await getPageContent();

        await createReactionCollector();

        async function assignData() {
            let query: PostgrestResponse<Database["public"]["Tables"]["users"]["Row"]>;

            switch (interaction.options.getSubcommand()) {
                case "list":
                    query = await supabase.from("users").select().contains("guilds[]", [interaction.guild.id]).order("birthday", { ascending: true }).not("birthday", "is", null);

                    birthdays = query.data;
                    break;

                case "upcoming":
                    query = await supabase.from("users").select().contains("guilds[]", [interaction.guild.id]).order("birthday", { ascending: true }).not("birthday", "is", null);

                    if (!query.data?.length) return;

                    birthdays = query.data.filter((data) => {
                        const currentDate = new Date();
                        const birthdayDate = new Date(data.birthday);
                        
                        [currentDate, birthdayDate].forEach((date) => {
                            date.setFullYear(new Date().getFullYear());
                        });

                        return birthdayDate.getTime() - currentDate.getTime() >= 0;
                    }).sort((a, b) => {
                        return new Date(a.birthday).getTime() - new Date(b.birthday).getTime();
                    });

                    break;
            }
        }

        async function getPageContent() {
            const itemsContent = birthdays.slice(page * 10, page * 10 + 10);
            const pageContent: string[] = ["```ansi"];

            for (const [index, item] of itemsContent.entries()) {
                const date = item.birthday;
                const user = item.user_id;

                const fetchUser = await Client.users.fetch(user);

                pageContent.push(
                    `\u001b[1;34m${index + (page * 10 + 1)}. \u001b[1;33m${fetchUser.username}\u001b[0;30m#${fetchUser.discriminator} \u001b[0m» \u001b[1;35m${moment(date).format("MM/DD/YYYY")} \u001b[0;30m(\u001b[1;36m${moment(date).fromNow(true)} old\u001b[0;30m)`,
                );
            }

            pageContent.push("```");

            const birthdaysEmbed = new Discord.EmbedBuilder().setDescription(pageContent.join("\n")).setColor("#33beff").setTitle("🎁 Birthdays list").setTimestamp().setFooter({
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
                return interaction.channel.messages.fetch(replyId).then((msg) => msg.edit({
                    embeds: [birthdaysEmbed],
                    components: [button],
                }));
            } else {
                await interaction.editReply({
                    embeds: [birthdaysEmbed],
                    components: [button],
                });

                replyId = await interaction.fetchReply().then((msg) => msg.id);
            }
        }

        function buttonChecker() {
            const index = page + 1;

            return birthdays.slice(index * 10, index * 10 + 10).length === 0;
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
