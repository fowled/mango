import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

// Fun command

/**
 * Replies with your money
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "money",
    description: "Replies with your bank account's money",
    category: "fun",

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
        const moneymodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("moneyAcc");
        const money = await moneymodel.findOne({ where: { idOfUser: interaction.member.user.id } });

        if (money) {
            return interaction.editReply({ content: `:dollar: Your account currently has **${money.get("money")}$**!` });
        } else {
            moneymodel.create({
                idOfUser: interaction.member.user.id,
                money: 500
            });

            return interaction.editReply("Since you are new to the bank, I just created an account with **500$** on it for you. Enjoy! :wink:");
        }
    }
}
