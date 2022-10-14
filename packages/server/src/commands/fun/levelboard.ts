import Discord from "discord.js";

import type {PrismaClient, Ranks} from "@prisma/client";

// Fun command

/**
 * answers with the guild's level leaderboard (levelboard)
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "levelboard",
    description: "Replies with the server XP level leaderboard",
    category: "fun",
    botPermissions: ["AddReactions"],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, _args: string[], prisma: PrismaClient) {
        let ranks: Ranks[];

        const medals = {
            1: "🥇",
            2: "🥈",
            3: "🥉"
        }

        let page = 0,
            replyId: string;

        await assignData();

        if (ranks.length === 0) {
            return interaction.editReply("It seems that the leaderboard is currently empty.");
        }

        await getPageContent();

        await createReactionCollector();

        async function assignData() {
            return (ranks = await prisma.ranks.findMany({
                orderBy: {xp: "desc"},
                where: {idOfGuild: interaction.guild.id}
            }));
        }

        async function getPageContent() {
            const itemsContent = ranks.slice(page * 10, page * 10 + 10);
            const pageContent: string[] = ["```ansi"];

            for (let i = 0; i < itemsContent.length; i++) {
                const xp = itemsContent[i]["xp"];
                const id = itemsContent[i]["idOfUser"];
                const user = await Client.users.fetch(id);

                pageContent.push(`\u001b[1;34m${medals[i + (page * 10 + 1)] ?? i + (page * 10 + 1) + "."} \u001b[1;33m${user.username}\u001b[0;30m#${user.discriminator} \u001b[0m» \u001b[1;35m${xp} XP \u001b[0;30m(\u001b[1;36mlevel ${Math.floor(xp / 50)}\u001b[0;30m)`);
            }

            pageContent.push("```")

            const levelEmbed = new Discord.EmbedBuilder().setDescription(pageContent.join("\n")).setColor("#33beff").setTitle("🎖 Levelboard").setTimestamp().setFooter({
                text: Client.user.username,
                iconURL: Client.user.displayAvatarURL()
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
                    embeds: [levelEmbed],
                    components: [button]
                }));
            } else {
                await interaction.editReply({embeds: [levelEmbed], components: [button]});

                replyId = await interaction.fetchReply().then((msg) => msg.id);
            }
        }

        function buttonChecker() {
            const index = page + 1;

            if (ranks.slice(index * 10, index * 10 + 10).length === 0) {
                return true;
            } else {
                return false;
            }
        }

        async function createReactionCollector() {
            interaction.fetchReply().then((msg: Discord.Message) => {
                const collector = msg.createMessageComponentCollector({componentType: Discord.ComponentType.Button});

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
