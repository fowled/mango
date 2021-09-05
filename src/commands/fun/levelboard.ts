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
            return interaction.reply("It seems that the leaderboard is currently empty.");
        }

        let page: number = 0;

        getPageContent(0);

        function fetchInteraction() {
            interaction.fetchReply().then((msg: Discord.Message) => {
                createReactionCollector(msg);
            });
        }

        function createReactionCollector(m: Discord.Message) {
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
            let pageContent: string[] = [];

            itemsContent.forEach(async (item, index) => {
                let object = { id: item["idOfUser"], xp: item["xp"] };
                let medal: string = (index) == 0 ? ":medal:" : (index) == 1 ? ":second_place:" : (index) == 2 ? ":third_place:" : "";
                let getUser: string = Client.users.cache.get(object.id).tag;

                pageContent.push(`${medal} ${index + (page * 10 + 1)}. **${getUser}** / *${object.xp}* xp → level \`${Math.floor(object.xp / 50)}\``);
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
                interaction.reply({ embeds: [levelEmbed], components: [button] }).then(async i => {
                    fetchInteraction();
                });
            } else {
                arg.update({ embeds: [levelEmbed], components: [button] }).then(async i => {
                    fetchInteraction();
                });
            }
        }

        function buttonChecker() {
            let index: number = page++;

            if (ranks.slice(index * 10, index * 10 + 10).length === 0) {
                return true;
            }
        }

        async function getUser(id: string) {
            return (await Client.users.fetch(id)).tag;
        }
    }
}
