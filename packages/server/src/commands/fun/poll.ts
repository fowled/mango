import Discord from 'discord.js';
import ms from 'ms';

// Fun command

/**
 * answers with the guild's level leaderboard (levelboard)
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: 'poll',
    description: 'Creates a poll',
    category: 'fun',
    botPermissions: ['AddReactions'],
    options: [
        {
            name: 'duration',
            type: 'STRING',
            description: "The poll's duration",
            required: true,
        },

        {
            name: 'first-option',
            type: 'STRING',
            description: 'The first required option',
            required: true,
        },

        {
            name: 'second-option',
            type: 'STRING',
            description: 'The second required option',
            required: true,
        },

        {
            name: 'third-option',
            type: 'STRING',
            description: 'The third optionnal option',
            required: false,
        },

        {
            name: 'fourth-option',
            type: 'STRING',
            description: 'The fourth optionnal option',
            required: false,
        },

        {
            name: 'fifth-option',
            type: 'STRING',
            description: 'The fifth optionnal option',
            required: false,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[]) {
        const time = args[0];

        args.shift();

        const splitMessage = args;
        const choices: string[] = [];
        const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

        let msgID: string;

        if (splitMessage.length > 6) {
            return interaction.editReply('5 args limit exceeded. Please provide less args.');
        }

        for (let i = 0; i < splitMessage.length; i++) {
            choices.push(`${reactions[i]} - ${splitMessage[i]}`);
        }

        const poll = new Discord.EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL(),
            })
            .setTitle(`Poll by **${interaction.user.tag}**`)
            .setDescription(choices.join('\n'))
            .setColor('#00BFFF')
            .setFooter({
                text: Client.user.username,
                iconURL: Client.user.avatarURL(),
            });

        interaction.editReply({ embeds: [poll] }).then(async () => {
            fetchInteraction();
        });

        function fetchInteraction() {
            interaction.fetchReply().then((msg: Discord.Message) => {
                addReactions(msg);
            });
        }

        async function addReactions(msg: Discord.Message) {
            for (let i = 0; i < splitMessage.length; i++) {
                await msg.react(reactions[i]);
            }

            msgID = msg.id;

            setTimeout(function () {
                createReactionCollector(msg);
            }, 300);
        }

        function createReactionCollector(msg: Discord.Message) {
            const filter = (reaction) => {
                return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'].includes(reaction.emoji.name);
            };

            msg.awaitReactions({ filter, time: ms(time), errors: ['time'] }).catch(() => {
                let msgContent = '';
                let numberOfReactions = 0;

                for (let i = 0; i < splitMessage.length; i++) {
                    numberOfReactions += Array.from(msg.reactions.cache.values())[i].count - 1;
                }

                for (let x = 0; x < splitMessage.length; x++) {
                    msgContent += `${reactions[x]} - ${splitMessage[x]} - ${Array.from(msg.reactions.cache.values())[x].count - 1} votes **[${Math.round(((Array.from(msg.reactions.cache.values())[x].count - 1) / numberOfReactions) * 100)}%]** \n`;
                }

                const votes = new Discord.EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.avatarURL(),
                    })
                    .setTitle('Results of the poll')
                    .setURL(`https://discordapp.com/channels/${interaction.guild.id}/${interaction.channel.id}/${msgID}`)
                    .setDescription(msgContent)
                    .setColor('#00BFFF')
                    .setFooter({
                        text: Client.user.username,
                        iconURL: Client.user.avatarURL(),
                    });

                interaction.channel.send({ embeds: [votes] });
            });
        }
    },
};
