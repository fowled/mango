import * as Discord from "discord.js";
import * as RichEmbed from "../../utils/Embed";
import * as Logger from "../../utils/Logger";

// Fun command

/**
 * Creates a giveaway
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const filter: Discord.CollectorFilter = (reaction, user) => ["🇦", "🇧", "🇨"].includes(reaction.emoji.name) && user.id === message.author.id;
	const giveawayEmbed: Discord.RichEmbed = new Discord.RichEmbed()
		.setAuthor(message.author.username, message.author.avatarURL)
		.setDescription("What would you like to do? \n\n:regional_indicator_a: - Create a giveaway \n:regional_indicator_a: - Close a giveaway \n:regional_indicator_a: - End a giveaway")
		.setColor("#0089FF");
	message.channel.send(giveawayEmbed).then(async (msg: Discord.Message) => {
		await msg.react("🇦");
		await msg.react("🇧");
		await msg.react("🇨");
		msg.awaitReactions(filter, {
			max: 1,
			time: 30000,
		}).then((collected) => {
			const reaction = collected.first();
			switch (reaction.emoji.name) {
				case "🇦":
					createGiveaway();
					break;

				case "🇧":
					closeGiveaway();
					break;

				case "🇨":
					endGiveaway();
					break;
			}
		});
	});

	function createGiveaway() {
		message.reply("Enter a name for the giveaway, and I'll create it for you.");
	}

	function closeGiveaway() {
		// à faire
	}

	function endGiveaway() {
		// à faire
	}
}
