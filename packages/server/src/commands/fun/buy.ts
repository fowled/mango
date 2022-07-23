import Discord from "discord.js";

import type { PrismaClient } from "@prisma/client";

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
			required: true,
		},
	],

	async execute(_Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], prisma: PrismaClient) {
		const ID = args[0];

		const item = await prisma.marketItems.findUnique({ where: { id: parseInt(ID) } });

		if (!item) {
			return interaction.editReply(`I'm sorry, but there is no item matching ID **${args[0]}**. To consult the market, do \`/market\` :wink:`);
		}

		const authorMoney = await prisma.moneyAccs.findUnique({ where: { idOfUser: interaction.member.user.id } });
		const sellerMoney = await prisma.moneyAccs.findUnique({ where: { idOfUser: item.sellerID } });

		if (!authorMoney) {
			return interaction.editReply("You have no money! Do `/money` to start using the market.");
		}

		if (authorMoney.money < item.price) {
			return interaction.editReply(`You must have \`${item.price - authorMoney.money}\` more dollars to get this item. :frowning:`);
		} else if (interaction.member.user.id === item.sellerID) {
			return interaction.editReply("You can't buy your own item...");
		}

		await prisma.inventoryItems.create({
			data: {
				name: item.name,
				price: item.price,
				sellerID: item.sellerID,
				authorID: interaction.member.user.id,
			},
		});

		await prisma.moneyAccs.update({ where: { idOfUser: authorMoney.idOfUser }, data: { money: authorMoney.money - item.price } });
		await prisma.moneyAccs.update({ where: { idOfUser: sellerMoney.idOfUser }, data: { money: sellerMoney.money + item.price } });

		await prisma.marketItems.delete({ where: { id: item.id } });

		interaction.editReply(`Item **${item.name}** successfully bought for *${item.price}$*.`);
	},
};
