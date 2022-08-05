import Discord from "discord.js";

import type { PrismaClient, Ranks } from "@prisma/client";

// Fun command

/**
 * answers with the guild's level leaderboard (levelboard)
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "levelboard",
	description: "Replies with the server XP level leaderboard",
	category: "fun",
	botPermissions: ["ADD_REACTIONS"],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction, _args: string[], prisma: PrismaClient) {
		let ranks: Ranks[];

		let page = 0,
			replyId: string;

		await assignData();

		if (ranks.length === 0) {
			return interaction.editReply("It seems that the leaderboard is currently empty.");
		}

		await getPageContent();

		await createReactionCollector();

		async function assignData() {
			return (ranks = await prisma.ranks.findMany({ orderBy: { xp: "desc" }, where: { idOfGuild: interaction.guild.id } }));
		}

		async function getPageContent() {
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

				new Discord.MessageButton().setCustomId("refresh").setLabel("🔄").setStyle("SUCCESS"),
			);

			if (replyId) {
				return interaction.channel.messages.fetch(replyId).then((msg) => msg.edit({ embeds: [levelEmbed], components: [button] }));
			} else {
				await interaction.editReply({ embeds: [levelEmbed], components: [button] });

				replyId = await interaction.fetchReply().then((msg) => msg.id);
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
