import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

import { timestamp, timestampYear } from "../../utils/Timestamp";

// Fun command

/**
 * Birthday module!
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "birthdays",
	description: "Lists all the guild birthdays",
	category: "fun",
	botPermissions: ["ADD_REACTIONS"],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, _args: string[], db: Sequelize.Sequelize) {
		const birthdaysmodel: Sequelize.ModelStatic<Sequelize.Model<any, any>> = db.model("birthdays");
		const birthdays = await birthdaysmodel.findAll({ order: [["birthdayTimestamp", "ASC"]], where: { idOfGuild: interaction.guild.id }, raw: true });

		if (!birthdays[0]) {
			return interaction.editReply("It seems like the birthday list is empty! Start by `/birthday add`ing one.");
		}

		let page: number = 0;

		getPageContent(page);

		function fetchInteraction() {
			interaction.fetchReply().then((msg: Discord.Message) => {
				createReactionCollector(msg);
			});
		}

		function createReactionCollector(m: Discord.Message) {
			const collector: Discord.InteractionCollector<Discord.MessageComponentInteraction> = m.createMessageComponentCollector({ componentType: "BUTTON", max: 1 });

			collector.on("collect", (i) => {
				if (i.user.id !== interaction.member.user.id) return;

				if (i.customId === "back") {
					page--;
				} else if (i.customId === "next") {
					page++;
				}

				getPageContent(page, i);
			});

			collector.on("end", () => {
				return;
			});
		}

		async function getPageContent(page: number, arg?: Discord.MessageComponentInteraction) {
			const itemsContent = birthdays.slice(page * 10, page * 10 + 10);
			const pageContent: string[] = [];

			for (let index = 0; index < itemsContent.length; index++) {
				const date = itemsContent[index]["birthdayTimestamp"];
				const user = itemsContent[index]["idOfUser"];
				let fetchUser = await Client.users.fetch(user);

				pageContent.push(`${index + (page * 10 + 1)}. ${fetchUser} • ${timestamp(date)} (${timestampYear(date)})`);
			}

			sendContent(pageContent.join("\n"), arg);
		}

		async function sendContent(content: string, arg?: Discord.MessageComponentInteraction) {
			const inventoryEmbed = new Discord.MessageEmbed().setDescription(content).setColor("#33beff").setTitle(`🎁 Birthdays list`).setTimestamp().setFooter(Client.user.username, Client.user.displayAvatarURL());

			const button = new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("back")
					.setLabel("◀")
					.setStyle("PRIMARY")
					.setDisabled(page === 0 ? true : false),

				new Discord.MessageButton().setCustomId("next").setLabel("▶").setStyle("PRIMARY").setDisabled(buttonChecker())
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
			const index: number = page + 1;

			if (birthdays.slice(index * 10, index * 10 + 10).length === 0) {
				return true;
			} else {
				return false;
			}
		}
	},
};
