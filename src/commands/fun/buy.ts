import * as Sequelize from "sequelize";
import * as Discord from "discord.js";

// Fun command

/**
 * Buys something on the black market (lmfao)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "buy",
    description: "Buy something of the market",
    options: [
        {
            name: "id",
            type: "STRING",
            description: "The ID of the item you want to buy",
            required: true
        }
    ],

    async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
        const ID = args[0];

        if (!ID) {
            return message.reply("In order to buy something, you must provide the item's ID.");
        }

        const marketmodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("marketItems");
        const marketItem = await marketmodel.findOne({ where: { id: ID } });

        if (!marketItem) {
            return message.reply(`I'm sorry, but there is no item matching ID **${args[0]}**. To consult the market, do \`ma!market\` :wink:`);
        }

        const itemName = marketItem.get("name");
        const itemPrice = marketItem.get("price");
        const itemSeller = marketItem.get("seller");
        const itemSellerID = marketItem.get("sellerID");

        const moneymodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("moneyAcc");
        const authorMoney = await moneymodel.findOne({ where: { idOfUser: message.member.user.id } });

        if (!authorMoney) {
            return message.reply("You don't have any money! Do `ma!money` to start using the market.");
        }

        const getAuthorMoney = authorMoney.get("money");
        const sellerMoney = await moneymodel.findOne({ where: { idOfUser: itemSellerID } });

        if (getAuthorMoney < itemPrice) {
            return message.reply(`You must have \`${(itemPrice as unknown as number) - (getAuthorMoney as unknown as number)}\` more dollars to get this item. :frowning:`);
        } else if (message.member.user.id == itemSellerID) {
            return message.reply("You can't buy your own item...");
        }

        const inventorymodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("inventoryItems");

        inventorymodel.create({
            name: itemName,
            price: itemPrice,
            seller: itemSeller,
            authorID: message.member.user.id
        });

        authorMoney.decrement(['money'], { by: itemPrice as unknown as number });
        sellerMoney.increment(['money'], { by: itemPrice as unknown as number });

        message.reply(`Item **${itemName}** successfully bought for *${itemPrice}$*.`);

        marketItem.destroy();
    }
};
