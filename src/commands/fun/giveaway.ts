import * as Discord from "discord.js";
import ms from "ms";

// Fun command

/**
 * Creates a giveaway
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	createGiveaway();

	async function createGiveaway() {
		message.reply("Enter a name for the giveaway, and I'll create it for you.");

		const channel: Discord.TextChannel = message.channel as Discord.TextChannel;

		const filter = (msg: Discord.Message) => msg.author.id == message.author.id;

		let giveawayName, giveawayRewards;

		await channel.awaitMessages(filter, { max: 1 })
			.then((collected) => {
				giveawayName = collected.first();
				message.reply(`Ok, I just created the **${giveawayName}** giveaway! Now, please enter the rewards :wink:`);
			});

		await channel.awaitMessages(filter, { max: 1 })
			.then((collected) => {
				giveawayRewards = collected.last();
				return message.reply(`Ok, here are the rewards of your giveaway: **${giveawayRewards}**! Finally, please select the duration of the giveaway, eg: \`[number]m\`, \`[number]d\`, or \`[number]w\``);
			});

		const durationCollector: () => Promise<void> = async () => {
			await channel.awaitMessages(filter, { max: 1, errors: ["time"] })
				.then((collected) => {
					const durationNumber: string = collected.last().content;

					message.channel.bulkDelete(7);

					const giveawayEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
						.setTitle("🎉🎈 Giveaway!")
						.setDescription(`**${giveawayName}** giveaway!! \nRewards: *${giveawayRewards}* \nEnds in \`${durationNumber}\` \nReact with :thumbsup: to enter!`)
						.setColor("RANDOM")
						.setAuthor(message.author.username, message.author.displayAvatarURL())
						.setTimestamp()
						.setFooter(Client.user.username, Client.user.displayAvatarURL())

					message.channel.send(giveawayEmbed).then(m => {
						m.react("👍🏻");

						const filter = (reaction: any, user: { id: string; }) => {
							return m.author.id == Client.user.id;
						};

						m.awaitReactions(filter, { time: ms(durationNumber) }).then(collected => {
							let users: Discord.User[][] = collected.map(u => u.users.cache.filter(u => !u.bot).map(u => u));
							let randomUser = users[0][Math.floor(Math.random() * users[0].length)];
							
							message.channel.send(`Congratulations ${randomUser} (**${randomUser.tag}** - *${randomUser.id}*) you won the giveaway! \nPrizes: \`${giveawayRewards}\` :eyes: \nLink to the giveaway: https://discord.com/channels/${message.guild.id}/${message.channel.id}/${m.id}`);
						});
					});


					let winner: Discord.GuildMember = message.guild.members.cache.random();

					if (winner.user.bot) {
						while (winner.user.bot) {
							winner = message.guild.members.cache.random();
						}
					}

				});
		};

		await durationCollector();
	}

}

const info = {
	name: "giveaway",
	description: "Creates a giveaway!",
	category: "fun",
	args: "given"
}

export { info };

