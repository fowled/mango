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
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const moneymodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("moneyAcc");
    const money = await moneymodel.findOne({ where: { idOfUser: message.author.id } });

    if (money) {
        return message.channel.send(`:dollar: Your account currently has **${money.get("money")}$**!`);
    } else {
        moneymodel.create({
            idOfUser: message.author.id,
            money: 500
        });

        return message.channel.send("Since you are new to the bank, I just created an account with **500$** on it for you. Enjoy! :wink:");
    }
}

const info = {
    name: "money",
    description: "Replies with your account's money",
    category: "fun",
    args: "none"
}

export { info };

