import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

// Fun command

/**
 * Sells something to the black market (lmfao)
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
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
            type: "STRING",
            description: "The item's price",
            required: true
        },

        {
            name: "item",
            type: "STRING",
            description: "The item's name",
            required: true
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
        const item: string = args.slice(1, args.length).join(" ");
        const price: string = args[0];

        const marketmodel: Sequelize.ModelStatic<Sequelize.Model<any, any>> = ops.sequelize.model("marketItems");

        const moneymodel: Sequelize.ModelStatic<Sequelize.Model<any, any>> = ops.sequelize.model("moneyAcc");
        const money = await moneymodel.findOne({ where: { idOfUser: interaction.member.user.id } });
 
        if (isNaN(price as unknown as number) || price.startsWith("-")) {
            return interaction.editReply(`**${price}** isn't a number. Please retry and remove every symbol of the price, eg: \`240$\` → \`240\``);
        } else if (item.includes("@")) {
            return interaction.editReply("I can't add this item to the market because it contains a mention. Be sure to remove it.");
        } else if (!money) {
            return interaction.editReply("It looks like you haven't created your account! Do `/money` first :wink:");
        } else if (item.length > 70) {
            return interaction.editReply("Your item name is too long!");
        }

        const getMoney = money.get("money");

        if (getMoney < price) {
            return interaction.editReply(`You can't sell this item at **${price}** because you only have **${money}**$.`);
        }

        const createdItem = await marketmodel.create({
            name: item,
            price: price,
            seller: interaction.member.user.tag,
            sellerID: interaction.member.user.id
        }).catch(e => {
            if (e.name == "SequelizeUniqueConstraintError") {
                return interaction.editReply("This object already exists! Please choose another name.");
            }
        });

        // @ts-ignore
        interaction.editReply(`The item \`${item}\` with price \`${price}\`$ was succesfully added to the market. ID of your item: **${createdItem.get("id")}** <:yes:835565213498736650>`);
    }
}
