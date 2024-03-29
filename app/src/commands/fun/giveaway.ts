import Discord from "discord.js";
import ms from "ms";

// Fun command

/**
 * Creates a giveaway
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "giveaway",
    description: "Creates a giveaway!",
    category: "fun",
    botPermissions: ["AddReactions"],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction) {
        createGiveaway();

        async function createGiveaway() {
            interaction.editReply("Enter a name for the giveaway, and I'll create it for you.");

            const channel = interaction.channel as Discord.TextChannel;

            const filter = (msg: Discord.Message) => msg.author.id === interaction.user.id;

            let giveawayName: string, giveawayRewards: string;

            await channel.awaitMessages({ filter: filter, max: 1 }).then((collected) => {
                giveawayName = collected.first().content;

                const content = `Ok, I just created the **${giveawayName}** giveaway! Now, please enter the rewards :wink:`;

                return interaction.followUp(content);
            });

            await channel.awaitMessages({ filter: filter, max: 1 }).then((collected) => {
                giveawayRewards = collected.last().content;

                const content = `Ok, here are the rewards of your giveaway: **${giveawayRewards}**! Finally, please select the duration of the giveaway, eg: \`[number]m\`, \`[number]d\`, or \`[number]w\``;

                return interaction.followUp(content);
            });

            const durationCollector: () => Promise<void> = async () => {
                await channel.awaitMessages({ filter: filter, max: 1, errors: ["time"] }).then((collected) => {
                    const durationNumber = collected.last().content;

                    if (!ms(durationNumber)) {
                        const content = "This isn't a correct duration time. Please retry with a valid one.";

                        return interaction.followUp(content);
                    }

                    const channel = interaction.channel as Discord.TextChannel;

                    channel.bulkDelete(7);

                    const giveawayEmbed = new Discord.EmbedBuilder()
                        .setTitle("🎉🎈 Giveaway!")
                        .setDescription(`**${giveawayName}** giveaway! \nRewards: *${giveawayRewards}* \nEnds in \`${durationNumber}\` \nReact with :thumbsup: to enter!`)
                        .setColor("Random")
                        .setAuthor({
                            name: interaction.user.username,
                            iconURL: interaction.user.displayAvatarURL(),
                        })
                        .setTimestamp()
                        .setFooter({
                            text: Client.user.username,
                            iconURL: Client.user.displayAvatarURL(),
                        });

                    interaction.channel.send({ embeds: [giveawayEmbed] }).then((m) => {
                        m.react("👍🏻");

                        const filter = () => {
                            return m.author.id === Client.user.id;
                        };

                        m.awaitReactions({
                            filter: filter,
                            time: ms(durationNumber),
                        }).then((collected) => {
                            const users = collected.map((u) => u.users.cache.filter((u) => !u.bot).map((u) => u));
                            const randomUser = users[0][Math.floor(Math.random() * users[0].length)];

                            interaction.channel.send(
                                `Congratulations ${randomUser} (**${randomUser.tag}** - *${randomUser.id}*) you won the giveaway! \nPrizes: \`${giveawayRewards}\` :eyes: \nLink to the giveaway: https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${m.id}`,
                            );
                        });
                    });
                });
            };

            await durationCollector();
        }
    },
};
