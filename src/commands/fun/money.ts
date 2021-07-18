import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

// Fun command

/**
 * Replies with your money
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "money",
    description: "Replies with your bank account's money",

    async execute(Client: Discord.Client, message: Discord.Message & Discord.CommandInteraction, args, ops) {
        const moneymodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("moneyAcc");
        const money = await moneymodel.findOne({ where: { idOfUser: message.member.user.id } });

        if (money) {
            return message.reply({ content: `:dollar: Your account currently has **${money.get("money")}$**!`, ephemeral: true });
        } else {
            moneymodel.create({
                idOfUser: message.member.user.id,
                money: 500
            });

            return message.reply("Since you are new to the bank, I just created an account with **500$** on it for you. Enjoy! :wink:");
        }
    }
}
