import Discord from "discord.js";

import type {PrismaClient} from "@prisma/client";

// Fun command

/**
 * Replies with your money
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "money",
    description: "Replies with your bank account's money",
    category: "fun",

    async execute(_Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, _args: string[], prisma: PrismaClient) {
        const account = await prisma.moneyAccs.findUnique({where: {idOfUser: interaction.user.id}});

        if (account) {
            return interaction.editReply({content: `:dollar: Your account currently has **${account.money}$**!`});
        } else {
            await prisma.moneyAccs.create({data: {idOfUser: interaction.user.id, money: 500}});

            return interaction.editReply("Since you are new to the bank, I just created an account with **500$** on it for you. Enjoy! :wink:");
        }
    },
};
