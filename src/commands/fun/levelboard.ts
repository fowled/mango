import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

// Fun command

/**
 * answers with the guild's level leaderboard (levelboard)
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "levelboard",
    description: "Replies with the server XP level leaderboard",
    category: "fun",
    botPermissions: ["ADD_REACTIONS"],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
        const Xp: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("ranks");
        const ranks = await Xp.findAll({ order: [["xp", "DESC"]], where: { idOfGuild: interaction.guild.id }, raw: true });

        if (!ranks[0]) {
            return interaction.editReply("It seems that the leaderboard is currently empty.");
        }

        let page: number = 0;

        getPageContent(page);

        async function fetchInteraction() {
            interaction.fetchReply().then((msg: Discord.Message) => {
                createReactionCollector(msg);
            });
        }

        async function createReactionCollector(m: Discord.Message) {
            const collector: Discord.InteractionCollector<Discord.MessageComponentInteraction> = m.createMessageComponentCollector({ componentType: 'BUTTON', max: 1 });

            collector.on("collect", i => {
                if (i.user.id !== interaction.member.user.id) return;

                if (i.customId === "back") {
                    page--;
                } else if (i.customId === "next") {
                    page++;
                }

                getPageContent(page, i);
            });

            collector.on("end", () => {
                return;
            });
        }

        function getPageContent(page: number, arg?: Discord.MessageComponentInteraction) {
            const itemsContent = ranks.slice(page * 10, page * 10 + 10);
            const pageContent: string[] = [];

            itemsContent.forEach((item, index) => {
                const object = { tag: item["nameOfUser"], xp: item["xp"] };

                pageContent.push(`${index + (page * 10 + 1)}. **${object.tag}** / *${object.xp}* xp → level \`${Math.floor(object.xp / 50)}\``);
            });

            const levelEmbed = new Discord.MessageEmbed()
                .setDescription(pageContent.join("\n"))
                .setColor("#33beff")
                .setTitle(`🎖 Levelboard`)
                .setTimestamp()
                .setFooter(Client.user.username, Client.user.displayAvatarURL())

            const button = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId("back")
                        .setLabel('◀')
                        .setStyle('PRIMARY')
                        .setDisabled(page === 0 ? true : false),

                    new Discord.MessageButton()
                        .setCustomId("next")
                        .setLabel('▶')
                        .setStyle('PRIMARY')
                        .setDisabled(buttonChecker())
                );

            if (!arg) {
                interaction.editReply({ embeds: [levelEmbed], components: [button] }).then(async () => {
                    fetchInteraction();
                });
            } else {
                arg.update({ embeds: [levelEmbed], components: [button] }).then(async () => {
                    fetchInteraction();
                });
            }
        }

        function buttonChecker() {
            const index: number = page + 1;

            if (ranks.slice(index * 10, index * 10 + 10).length === 0) {
                return true;
            } else {
                return false;
            }
        }
    }
}
