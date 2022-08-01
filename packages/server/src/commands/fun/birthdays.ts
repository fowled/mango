import Discord from "discord.js";

import { timestamp, timestampYear } from "../../utils/timestamp";

import type { Birthdays, PrismaClient } from "@prisma/client";

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
	subcommands: [
		{
			name: "list",
			description: "Lists all birthdays",
			type: 1,
		},
		{
			name: "upcoming",
			description: "Lists upcoming birthdays",
			type: 1,
		},
	],
	botPermissions: ["ADD_REACTIONS"],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, _args: string[], prisma: PrismaClient) {
		let birthdays: Birthdays[];

		let page = 0;

		await assignData();

		if (birthdays.length === 0) {
			return interaction.editReply("It seems like the birthday list is empty! You may want to `/birthday add` one.");
		}

		await getPageContent();

		async function assignData() {
			switch (interaction.options.getSubcommand()) {
				case "list":
					birthdays = await prisma.birthdays.findMany({ orderBy: [{ birthdayTimestamp: "asc" }], where: { idOfGuild: interaction.guild.id } });
					break;

				case "upcoming":
					birthdays = (await prisma.birthdays.findMany({ where: { idOfGuild: interaction.guild.id } }))
						.filter((data) => {
							const currentDate = new Date();
							const birthdayDate = new Date(data.birthday);

							birthdayDate.setMonth(birthdayDate.getMonth() + 1);

							[currentDate, birthdayDate].forEach((date) => {
								date.setFullYear(new Date().getFullYear());
							});

							if (birthdayDate.getTime() - currentDate.getTime() >= 0) {
								return true;
							} else {
								return false;
							}
						})
						.sort((a, b) => {
							return new Date(a.birthday).getTime() - new Date(b.birthday).getTime();
						});
					break;
			}
		}

		async function getPageContent(arg?: Discord.MessageComponentInteraction) {
			const itemsContent = birthdays.slice(page * 10, page * 10 + 10);
			const pageContent: string[] = [];

			for (let index = 0; index < itemsContent.length; index++) {
				const date = itemsContent[index]["birthdayTimestamp"];
				const user = itemsContent[index]["idOfUser"];
				const fetchUser = await Client.users.fetch(user);

				pageContent.push(`${index + (page * 10 + 1)}. ${fetchUser} • ${timestamp(date)} (${timestampYear(date)})`);
			}

			const birthdaysEmbed = new Discord.MessageEmbed().setDescription(pageContent.join("\n")).setColor("#33beff").setTitle("🎁 Birthdays list").setTimestamp().setFooter(Client.user.username, Client.user.displayAvatarURL());

			const button = new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("back")
					.setLabel("◀")
					.setStyle("PRIMARY")
					.setDisabled(page === 0 ? true : false),

				new Discord.MessageButton().setCustomId("next").setLabel("▶").setStyle("PRIMARY").setDisabled(buttonChecker()),
			);

			if (!arg) {
				interaction.editReply({ embeds: [birthdaysEmbed], components: [button] }).then(async () => {
					fetchInteraction();
				});
			} else {
				arg.update({ embeds: [birthdaysEmbed], components: [button] }).then(async () => {
					fetchInteraction();
				});
			}
		}

		function buttonChecker() {
			const index = page + 1;

			if (birthdays.slice(index * 10, index * 10 + 10).length === 0) {
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

				getPageContent(i);
			});

			collector.on("end", () => {
				return;
			});
		}
	},
};
