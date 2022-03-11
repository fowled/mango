import * as Sequelize from "sequelize";
import * as Discord from "discord.js";

// Fun command

/**
 * Buys something on the black market (lmfao)
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
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
            type: "STRING",
            description: "The ID of the item you want to buy",
            required: true
        }
    ],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
        const ID = args[0];

        const marketmodel: Sequelize.ModelStatic<Sequelize.Model<any, any>> = ops.sequelize.model("marketItems");
        const marketItem = await marketmodel.findOne({ where: { id: ID } });

        if (!marketItem) {
            return interaction.editReply(`I'm sorry, but there is no item matching ID **${args[0]}**. To consult the market, do \`/market\` :wink:`);
        }

        const itemName = marketItem.get("name");
        const itemPrice = marketItem.get("price");
        const itemSellerID = marketItem.get("sellerID");

        const moneymodel: Sequelize.ModelStatic<Sequelize.Model<any, any>> = ops.sequelize.model("moneyAcc");
        const authorMoney = await moneymodel.findOne({ where: { idOfUser: interaction.member.user.id } });

        if (!authorMoney) {
            return interaction.editReply("You don't have any money! Do `/money` to start using the market.");
        }

        const getAuthorMoney = authorMoney.get("money");
        const sellerMoney = await moneymodel.findOne({ where: { idOfUser: itemSellerID } });

        if (getAuthorMoney < itemPrice) {
            return interaction.editReply(`You must have \`${(itemPrice as unknown as number) - (getAuthorMoney as unknown as number)}\` more dollars to get this item. :frowning:`);
        } else if (interaction.member.user.id == itemSellerID) {
            return interaction.editReply("You can't buy your own item...");
        }

        const inventorymodel: Sequelize.ModelStatic<Sequelize.Model<any, any>> = ops.sequelize.model("inventoryItems");

        inventorymodel.create({
            name: itemName,
            price: itemPrice,
            sellerID: itemSellerID,
            authorID: interaction.member.user.id
        });

        authorMoney.decrement(['money'], { by: itemPrice as unknown as number });
        sellerMoney.increment(['money'], { by: itemPrice as unknown as number });

        interaction.editReply(`Item **${itemName}** successfully bought for *${itemPrice}$*.`);

        marketItem.destroy();
    }
};
