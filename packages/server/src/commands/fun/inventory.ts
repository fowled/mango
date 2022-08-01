import Discord from "discord.js";

import type { InventoryItems, PrismaClient } from "@prisma/client";

// Fun command

/**
 * Shows your inventory w/ market
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "inventory",
	description: "Shows your inventory",
	category: "fun",
	botPermissions: ["ADD_REACTIONS"],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, _args: string[], prisma: PrismaClient) {
		let inventory: InventoryItems[];

		let page = 0;

		await assignData();

		if (inventory.length === 0) {
			return interaction.editReply("Your inventory is empty! Start by doing `/market` and then buy something with the `/buy [ID of the item]` command.");
		}

		getPageContent(page);

		async function assignData() {
			return (inventory = await prisma.inventoryItems.findMany({ where: { authorID: interaction.member.user.id } }));
		}

		async function getPageContent(page: number, arg?: Discord.MessageComponentInteraction) {
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
			);

			if (!arg) {
				interaction.editReply({ embeds: [inventoryEmbed], components: [button] }).then(async () => {
					fetchInteraction();
				});
			} else {
				arg.update({ embeds: [inventoryEmbed], components: [button] }).then(async () => {
					fetchInteraction();
				});
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

		function fetchInteraction() {
			interaction.fetchReply().then((msg: Discord.Message) => {
				createReactionCollector(msg);
			});
		}

		function createReactionCollector(m: Discord.Message) {
			const collector = m.createMessageComponentCollector({ componentType: "BUTTON", max: 1 });

			collector.on("collect", async (i) => {
				if (i.user.id !== interaction.member.user.id) return;

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
