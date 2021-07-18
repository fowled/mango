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
module.exports = {
	name: "giveaway",
	description: "Creates a giveaway!",

	async execute(Client: Discord.Client, message: Discord.Message & Discord.CommandInteraction, args, ops) {
		createGiveaway();

		let isCommand: boolean = message.type === "APPLICATION_COMMAND";
		
		async function createGiveaway() {
			message.reply("Enter a name for the giveaway, and I'll create it for you.");

			const channel: Discord.TextChannel = message.channel as Discord.TextChannel;

			const filter = (msg: Discord.Message) => msg.author.id == message.member.user.id;

			let giveawayName, giveawayRewards;

			await channel.awaitMessages({ filter: filter, max: 1 })
				.then((collected) => {
					giveawayName = collected.first();
					let content: string = `Ok, I just created the **${giveawayName}** giveaway! Now, please enter the rewards :wink:`;
					return isCommand ? message.followUp(content) : message.reply(content);
				});

			await channel.awaitMessages({ filter: filter, max: 1 })
				.then((collected) => {
					giveawayRewards = collected.last();
					let content: string = `Ok, here are the rewards of your giveaway: **${giveawayRewards}**! Finally, please select the duration of the giveaway, eg: \`[number]m\`, \`[number]d\`, or \`[number]w\``;
					return isCommand ? message.followUp(content) : message.reply(content);
				});

			const durationCollector: () => Promise<void> = async () => {
				await channel.awaitMessages({ filter: filter, max: 1, errors: ["time"] })
					.then((collected) => {
						const durationNumber: string = collected.last().content;

						if (!ms(durationNumber)) {
							let content: string = "This isn't a correct duration time. Please retry with a valid one.";
							return isCommand ? message.followUp(content) : message.reply(content);
						}

						const channel = message.channel as unknown as Discord.TextChannel;
						channel.bulkDelete(7);

						const giveawayEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
							.setTitle("🎉🎈 Giveaway!")
							.setDescription(`**${giveawayName}** giveaway! \nRewards: *${giveawayRewards}* \nEnds in \`${durationNumber}\` \nReact with :thumbsup: to enter!`)
							.setColor("RANDOM")
							.setAuthor(message.member.user.username, message.member.user.displayAvatarURL())
							.setTimestamp()
							.setFooter(Client.user.username, Client.user.displayAvatarURL())

						message.channel.send({ embeds: [giveawayEmbed] }).then(m => {
							m.react("👍🏻");

							const filter = (reaction: any, user: { id: string; }) => {
								return m.author.id == Client.user.id;
							};

							m.awaitReactions({ filter: filter, time: ms(durationNumber) }).then(collected => {
								let users: Discord.User[][] = collected.map(u => u.users.cache.filter(u => !u.bot).map(u => u));
								let randomUser = users[0][Math.floor(Math.random() * users[0].length)];

								message.channel.send(`Congratulations ${randomUser} (**${randomUser.tag}** - *${randomUser.id}*) you won the giveaway! \nPrizes: \`${giveawayRewards}\` :eyes: \nLink to the giveaway: https://discord.com/channels/${message.guild.id}/${message.channel.id}/${m.id}`);
							});
						});

					});
			};

			await durationCollector();
		}
	}
}
