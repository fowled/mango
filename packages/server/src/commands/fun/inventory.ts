import Discord from "discord.js";

import type { InventoryItems, PrismaClient } from "@prisma/client";

// Fun command

/**
 * Shows your inventory w/ market
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "inventory",
	description: "Shows your inventory",
	category: "fun",
	botPermissions: ["ADD_REACTIONS"],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction, _args: string[], prisma: PrismaClient) {
		let inventory: InventoryItems[];

		let page = 0,
			replyId: string;

		await assignData();

		if (inventory.length === 0) {
			return interaction.editReply("Your inventory is empty! Start by doing `/market` and then buy something with the `/buy [ID of the item]` command.");
		}

		await getPageContent();

		await createReactionCollector();

		async function assignData() {
			return (inventory = await prisma.inventoryItems.findMany({ where: { authorID: interaction.user.id } }));
		}

		async function getPageContent() {
			const itemsContent = inventory.slice(page * 10, page * 10 + 10);
			const pageContent: string[] = [];

			for (let index = 0; index < itemsContent.length; index++) {
				const itemName = itemsContent[index]["name"];
				const itemPrice = itemsContent[index]["price"];
				const itemSeller = itemsContent[index]["sellerID"];
				const user = await Client.users.fetch(itemSeller);

				pageContent.push(`${index + (page * 10 + 1)}. \`${itemName}\` - \`${itemPrice}$\` | Sold by \`${user.tag}\``);
			}

			const inventoryEmbed = new Discord.MessageEmbed().setDescription(pageContent.join("\n")).setColor("#33beff").setTitle("🛒 Inventory").setTimestamp().setFooter(Client.user.username, Client.user.displayAvatarURL());

			const button = new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("back")
					.setLabel("◀")
					.setStyle("PRIMARY")
					.setDisabled(page === 0 ? true : false),

				new Discord.MessageButton().setCustomId("next").setLabel("▶").setStyle("PRIMARY").setDisabled(buttonChecker()),

				new Discord.MessageButton().setCustomId("refresh").setLabel("🔄").setStyle("SUCCESS"),
			);

			if (replyId) {
				return interaction.channel.messages.fetch(replyId).then((msg) => msg.edit({ embeds: [inventoryEmbed], components: [button] }));
			} else {
				await interaction.editReply({ embeds: [inventoryEmbed], components: [button] });

				replyId = await interaction.fetchReply().then((msg) => msg.id);
			}
		}

		function buttonChecker() {
			const index = page + 1;

			if (inventory.slice(index * 10, index * 10 + 10).length === 0) {
				return true;
			} else {
				return false;
			}
		}

		async function createReactionCollector() {
			interaction.fetchReply().then((msg: Discord.Message) => {
				const collector = msg.createMessageComponentCollector({ componentType: "BUTTON" });

				collector.on("collect", async (i) => {
					if (i.customId === "back") {
						page--;
					} else if (i.customId === "next") {
						page++;
					}

					await assignData();

					getPageContent();
				});

				collector.on("end", () => {
					return;
				});
			});
		}
	},
};
