import Discord from "discord.js";

import { timestamp, timestampYear } from "utils/timestamp";

import type { Birthdays, PrismaClient } from "@prisma/client";

// Fun command

/**
 * Birthday module!
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
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

	async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, _args: string[], prisma: PrismaClient) {
		let birthdays: Birthdays[];

		let page = 0,
			replyId: string;

		await assignData();

		if (birthdays.length === 0) {
			return interaction.editReply("It seems like the birthday list is empty! You may want to `/birthday add` one.");
		}

		await getPageContent();

		await createReactionCollector();

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

							return birthdayDate.getTime() - currentDate.getTime() >= 0;
						})
						.sort((a, b) => {
							return new Date(a.birthday).getTime() - new Date(b.birthday).getTime();
						});
					break;
			}
		}

		async function getPageContent() {
			const itemsContent = birthdays.slice(page * 10, page * 10 + 10);
			const pageContent: string[] = [];

			for (let index = 0; index < itemsContent.length; index++) {
				const date = itemsContent[index]["birthdayTimestamp"];
				const user = itemsContent[index]["idOfUser"];
				const fetchUser = await Client.users.fetch(user);

				pageContent.push(`${index + (page * 10 + 1)}. ${fetchUser} • ${timestamp(date)} (${timestampYear(date)})`);
			}

            const birthdaysEmbed = new Discord.EmbedBuilder().setDescription(pageContent.join("\n")).setColor("#33beff").setTitle("🎁 Birthdays list").setTimestamp().setFooter({text: Client.user.username, iconURL: Client.user.displayAvatarURL()});

			const button = new Discord.ActionRowBuilder<Discord.ButtonBuilder>().addComponents(
				new Discord.ButtonBuilder()
					.setCustomId("back")
					.setLabel("◀")
					.setStyle(Discord.ButtonStyle.Primary)
					.setDisabled(page === 0),

				new Discord.ButtonBuilder().setCustomId("next").setLabel("▶").setStyle(Discord.ButtonStyle.Primary).setDisabled(buttonChecker()),

				new Discord.ButtonBuilder().setCustomId("refresh").setLabel("🔄").setStyle(Discord.ButtonStyle.Success),
			);

			if (replyId) {
				return interaction.channel.messages.fetch(replyId).then((msg) => msg.edit({ embeds: [birthdaysEmbed], components: [button] }));
			} else {
				await interaction.editReply({ embeds: [birthdaysEmbed], components: [button] });

				replyId = await interaction.fetchReply().then((msg) => msg.id);
			}
		}

		function buttonChecker() {
			const index = page + 1;

			return birthdays.slice(index * 10, index * 10 + 10).length === 0;
		}

		async function createReactionCollector() {
			interaction.fetchReply().then((msg: Discord.Message) => {
				const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button });

				collector.on("collect", async (i) => {
					if (i.customId === "back") {
						page--;
					} else if (i.customId === "next") {
						page++;
					}

					await assignData();

					await getPageContent();
				});

				collector.on("end", () => {
					return;
				});
			});
		}
	},
};
