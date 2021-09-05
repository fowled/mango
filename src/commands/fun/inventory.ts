import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

// Fun command

/**
 * Shows your inventory w/ market
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "inventory",
    description: "Shows your inventory",
    category: "fun",
    botPermissions: ["ADD_REACTIONS"],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
        const inventorymodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("inventoryItems");
        const authorinventory = await inventorymodel.findAll({ where: { authorID: interaction.member.user.id } });

        if (!authorinventory[0]) {
            return interaction.reply("Your inventory is empty! Start by doing `/market` and then buy something with the `/buy [ID of the item]` command.");
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
            const itemsContent = authorinventory.slice(page * 10, page * 10 + 10);
            let pageContent: string[] = [];

            itemsContent.forEach((item, index) => {
                let object = { name: item["name"], price: item["price"], seller: item["seller"] };

                pageContent.push(`${index + (page * 10 + 1)}. \`${object.name}\` - \`${object.price}$\` | Sold by \`${object.seller}\``);
            });

            if (itemsContent.length === 0) {
                pageContent.push("Nothing to see here!");
                pageContent.push("Use the ◀ button to get back to the market.");
            }

            const inventoryEmbed = new Discord.MessageEmbed()
                .setDescription(pageContent.join("\n"))
                .setColor("#33beff")
                .setTitle(`🛒 Inventory`)
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
                        .setDisabled(buttonChecker()),
                );

            if (!arg) {
                interaction.reply({ embeds: [inventoryEmbed], components: [button] }).then(async i => {
                    fetchInteraction();
                });
            } else {
                arg.update({ embeds: [inventoryEmbed], components: [button] }).then(async i => {
                    fetchInteraction();
                });
            }
        }

        function buttonChecker() {
            let index: number = page + 1;

            if (authorinventory.slice(index * 10, index * 10 + 10).length === 0) {
                return true;
            } else {
                return false;
            }
        }
    }
}
