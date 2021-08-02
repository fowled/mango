import * as Discord from "discord.js";
import ms from "ms";

// Fun command

/**
 * answers with the guild's level leaderboard (levelboard)
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "poll",
    description: "Creates a poll",
    category: "fun",
    options: [
        {
            name: "duration",
            type: "STRING",
            description: "The poll's duration",
            required: true
        },

        {
            name: "first-option",
            type: "STRING",
            description: "The first required option",
            required: true
        },

        {
            name: "second-option",
            type: "STRING",
            description: "The second required option",
            required: true
        },

        {
            name: "third-option",
            type: "STRING",
            description: "The third optionnal option",
            required: false
        },

        {
            name: "fourth-option",
            type: "STRING",
            description: "The fourth optionnal option",
            required: false
        },

        {
            name: "fifth-option",
            type: "STRING",
            description: "The fifth optionnal option",
            required: false
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
        const time = args[0];
        args.shift();
        let splitMessage = args;
        let choices: string[] = [];
        let reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
        let msgID;

        if (splitMessage.length > 6) {
            return interaction.reply("Not-that-fatal error: 5 args limit exceeded. Please provide less args.");
        }

        for (let i = 0; i < splitMessage.length; i++) {
            choices.push(`${reactions[i]} - ${splitMessage[i]}`);
        }

        const poll = new Discord.MessageEmbed()
            .setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
            .setTitle(`Poll by **${interaction.member.user.tag}**`)
            .setDescription(choices.join("\n"))
            .setColor("#00BFFF")
            .setFooter(Client.user.username, Client.user.avatarURL())

        interaction.reply({ embeds: [poll] }).then(async msg => {
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
            const filter = (reaction, user) => {
                return ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"].includes(reaction.emoji.name);
            };

            msg.awaitReactions({ filter, time: ms(time), errors: ["time"] }).catch((collected: Discord.Collection<string, Discord.MessageReaction>) => {
                let msgContent = "";
                let numberOfReactions = 0;

                for (var i = 0; i < splitMessage.length; i++) {
                    numberOfReactions += (Array.from(msg.reactions.cache.values())[i].count - 1);
                }

                for (var x = 0; x < splitMessage.length; x++) {
                    msgContent += `${reactions[x]} - ${splitMessage[x]} - ${Array.from(msg.reactions.cache.values())[x].count - 1} votes **[${Math.round((Array.from(msg.reactions.cache.values())[x].count - 1) / numberOfReactions * 100)}%]** \n`;
                }

                const votes = new Discord.MessageEmbed()
                    .setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                    .setTitle("Results of the poll")
                    .setURL(`https://discordapp.com/channels/${interaction.guild.id}/${interaction.channel.id}/${msgID}`)
                    .setDescription(msgContent)
                    .setColor("#00BFFF")
                    .setFooter(Client.user.username, Client.user.avatarURL())

                interaction.channel.send({ embeds: [votes] });
            });
        }
    }
}
