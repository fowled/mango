import Discord from "discord.js";

import type { PrismaClient, Ranks } from "@prisma/client";

// Fun command

/**
 * answers with the guild's level leaderboard (levelboard)
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "levelboard",
	description: "Replies with the server XP level leaderboard",
	category: "fun",
	botPermissions: ["ADD_REACTIONS"],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, _args: string[], prisma: PrismaClient) {
		let ranks: Ranks[];

		let page = 0;

		await assignData();

		if (ranks.length === 0) {
			return interaction.editReply("It seems that the leaderboard is currently empty.");
		}

		getPageContent(page);

		async function assignData() {
			return ranks = await prisma.ranks.findMany({ orderBy: { xp: "desc" }, where: { idOfGuild: interaction.guild.id } });
		}

		async function getPageContent(page: number, arg?: Discord.MessageComponentInteraction) {
			const itemsContent = ranks.slice(page * 10, page * 10 + 10);
			const pageContent: string[] = [];

			for (let i = 0; i < itemsContent.length; i++) {
				const xp = itemsContent[i]["xp"];
				const id = itemsContent[i]["idOfUser"];
				const user = await Client.users.fetch(id);

				pageContent.push(`${i + (page * 10 + 1)}. **${user}** / *${xp}* xp → level \`${Math.floor(xp / 50)}\``);
			}

			const levelEmbed = new Discord.MessageEmbed().setDescription(pageContent.join("\n")).setColor("#33beff").setTitle("🎖 Levelboard").setTimestamp().setFooter(Client.user.username, Client.user.displayAvatarURL());

			const button = new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("back")
					.setLabel("◀")
					.setStyle("PRIMARY")
					.setDisabled(page === 0 ? true : false),

				new Discord.MessageButton().setCustomId("next").setLabel("▶").setStyle("PRIMARY").setDisabled(buttonChecker()),
			);

			if (!arg) {
				interaction.editReply({ embeds: [levelEmbed], components: [button] }).then(async () => {
					fetchInteraction();
				});
			} else {
				arg.update({ embeds: [levelEmbed], components: [button] }).then(async () => {
					fetchInteraction();
				});
			}
		}

		function buttonChecker() {
			const index = page + 1;

			if (ranks.slice(index * 10, index * 10 + 10).length === 0) {
				return true;
			} else {
				return false;
			}
		}

		async function fetchInteraction() {
			interaction.fetchReply().then((msg: Discord.Message) => {
				createReactionCollector(msg);
			});
		}

		async function createReactionCollector(m: Discord.Message) {
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
