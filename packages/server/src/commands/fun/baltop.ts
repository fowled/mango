import Discord, {ButtonBuilder, ButtonStyle, ComponentType} from "discord.js";

import type {MoneyAccs, PrismaClient} from "@prisma/client";

// Fun command

/**
 * Shows the richest Mango users
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "baltop",
    description: "Shows the richest Mango users",
    category: "fun",
    botPermissions: ["AddReactions"],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, _args: string[], prisma: PrismaClient) {
        let marketUsers: MoneyAccs[];

        const medals = {
            1: "🥇",
            2: "🥈",
            3: "🥉"
        }

        let page = 0,
            replyId: string;

        await assignData();

        if (marketUsers.length === 0) {
            return interaction.editReply("It seems like nobody has a Mango bank account.");
        }

        await getPageContent();

        await createReactionCollector();

        async function assignData() {
            return (marketUsers = await prisma.moneyAccs.findMany({orderBy: [{money: "desc"}]}));
        }

        async function getPageContent() {
            const itemsContent = marketUsers.slice(page * 10, page * 10 + 10);
            const pageContent: string[] = ["```ansi"];

            for (let index = 0; index < itemsContent.length; index++) {
                const wealth = itemsContent[index]["money"];
                const userId = itemsContent[index]["idOfUser"];
                const user = await Client.users.fetch(userId);

                pageContent.push(`\u001b[1;34m${medals[index + (page * 10 + 1)] ?? index + (page * 10 + 1) + "."} \u001b[1;33m${user.username}\u001b[0;30m#${user.discriminator}\u001b[0m »\u001b[1;36m ${wealth}$`);
            }

            pageContent.push("```");

            const usersEmbed = new Discord.EmbedBuilder()
                .setDescription(pageContent.join("\n"))
                .setColor("#33beff")
                .setTitle("👛 Top balances")
                .setTimestamp()
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.displayAvatarURL()
                });

            const button = new Discord.ActionRowBuilder<ButtonBuilder>().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("back")
                    .setLabel("◀")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 0),

                new Discord.ButtonBuilder()
                    .setCustomId("next")
                    .setLabel("▶")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(buttonChecker()),

                new Discord.ButtonBuilder()
                    .setCustomId("refresh")
                    .setLabel("🔄")
                    .setStyle(ButtonStyle.Success),
            );

            if (replyId) {
                return interaction.channel.messages.fetch(replyId).then((msg) => msg.edit({
                    embeds: [usersEmbed],
                    components: [button]
                }));
            } else {
                await interaction.editReply({embeds: [usersEmbed], components: [button]});

                replyId = await interaction.fetchReply().then((msg) => msg.id);
            }
        }

        function buttonChecker() {
            const index = page + 1;

            return marketUsers.slice(index * 10, index * 10 + 10).length === 0;
        }

        async function createReactionCollector() {
            interaction.fetchReply().then((msg: Discord.Message) => {
                const collector = msg.createMessageComponentCollector({componentType: ComponentType.Button});

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
