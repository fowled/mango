import Discord from "discord.js";

import type { MarketItems, PrismaClient } from "@prisma/client";

// Fun command

/**
 * Shows the black market (lmfao)
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "market",
	description: "Replies with the current Mango's marketplace",
	category: "fun",
	botPermissions: ["ADD_REACTIONS"],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, _args: string[], prisma: PrismaClient) {
		let marketItems: MarketItems[];

		let page = 0;

		await assignData();

		if (marketItems.length === 0) {
			return interaction.editReply("It seems like the market is empty! Start by `/sell`ing an object :wink:");
		}

		getPageContent(page);

		async function assignData() {
			return (marketItems = await prisma.marketItems.findMany());
		}

		async function getPageContent(page: number, arg?: Discord.MessageComponentInteraction) {
			const itemsContent = marketItems.slice(page * 10, page * 10 + 10);
			const pageContent: string[] = [];

			for (let index = 0; index < itemsContent.length; index++) {
				const itemName = itemsContent[index]["name"];
				const itemPrice = itemsContent[index]["price"];
				const itemSeller = itemsContent[index]["sellerID"];
				const itemId = itemsContent[index]["id"];
				const user: Discord.User = await Client.users.fetch(itemSeller);

				pageContent.push(`${index + (page * 10 + 1)}. \`${itemName}\` - \`${itemPrice}$\` | Sold by \`${user.tag}\` » \`${itemId}\``);
			}

			const marketEmbed = new Discord.MessageEmbed().setDescription(pageContent.join("\n")).setColor("#33beff").setTitle("🛒 Market").setTimestamp().setFooter(Client.user.username, Client.user.displayAvatarURL());

			const button = new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("back")
					.setLabel("◀")
					.setStyle("PRIMARY")
					.setDisabled(page === 0 ? true : false),

				new Discord.MessageButton().setCustomId("next").setLabel("▶").setStyle("PRIMARY").setDisabled(buttonChecker()),

				new Discord.MessageButton().setCustomId("refresh").setLabel("🔄").setStyle("SUCCESS"),
			);

			if (!arg) {
				interaction.editReply({ embeds: [marketEmbed], components: [button] }).then(async () => {
					fetchInteraction();
				});
			} else {
				arg.update({ embeds: [marketEmbed], components: [button] }).then(async () => {
					fetchInteraction();
				});
			}
		}

		function buttonChecker() {
			const index = page + 1;

			if (marketItems.slice(index * 10, index * 10 + 10).length === 0) {
				return true;
			} else {
				return false;
			}
		}

		function fetchInteraction() {
			interaction.fetchReply().then((msg: Discord.Message) => {
				createReactionCollector(msg);
			});
		}

		function createReactionCollector(m: Discord.Message) {
			const collector = m.createMessageComponentCollector({ componentType: "BUTTON", max: 1 });

			collector.on("collect", async (i) => {
				if (i.customId === "back") {
					page--;
				} else if (i.customId === "next") {
					page++;
				}

				await assignData();

				getPageContent(page, i);
			});

			collector.on("end", () => {
				return;
			});
		}
	},
};
