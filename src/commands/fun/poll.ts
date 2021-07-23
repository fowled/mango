import * as Discord from "discord.js";
import ms from "ms";

// Fun command

/**
 * answers with the guild's level leaderboard (levelboard)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
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

    async execute(Client: Discord.Client, message: Discord.Message & Discord.CommandInteraction, args, ops) {
        if (args.length === 0) {
            return message.reply("It looks like you're having trouble using that command. Here's the syntax: `ma!poll [duration] | option 1 | up to 5 options`.");
        }

        const time = message.type === "APPLICATION_COMMAND" ? args[0] : message.content.split("poll")[1].trim().split(" | ")[0];
        args.shift();
        let splitMessage = message.type === "APPLICATION_COMMAND" ? args : message.content.split(`${time} |`)[1].split(" | ");
        let choices: string[] = [];
        let reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
        let msgID;

        if (splitMessage.length > 6) {
            return message.reply("Not-that-fatal error: 5 args limit exceeded. Please provide less args.");
        }

        for (let i = 0; i < splitMessage.length; i++) {
            choices.push(`${reactions[i]} - ${splitMessage[i]}`);
        }

        const poll = new Discord.MessageEmbed()
            .setAuthor(message.member.user.username, message.member.user.avatarURL())
            .setTitle(`Poll by **${message.member.user.tag}**`)
            .setDescription(choices.join("\n"))
            .setColor("#00BFFF")
            .setFooter(Client.user.username, Client.user.avatarURL())

        message.reply({ embeds: [poll] }).then(async msg => {
            (message.type === "APPLICATION_COMMAND") ? fetchInteraction() : addReactions(msg);
        });

        function fetchInteraction() {
            message.fetchReply().then((msg: Discord.Message) => {
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

            msg.awaitReactions({ filter, time: ms(time), errors: ["time"] })
                .then((collected: Discord.Collection<string, Discord.MessageReaction>) => {
                }).catch((collected: Discord.Collection<string, Discord.MessageReaction>) => {
                    let msgContent = "";
                    let numberOfReactions = 0;

                    for (var i = 0; i < splitMessage.length; i++) {
                        numberOfReactions += (msg.reactions.cache.array()[i].users.cache.size - 1);
                    }

                    for (var x = 0; x < splitMessage.length; x++) {
                        msgContent += `${reactions[x]} - ${splitMessage[x]} - ${msg.reactions.cache.array()[x].count - 1} votes **[${Math.round((msg.reactions.cache.array()[x].count - 1) / numberOfReactions * 100)}%]** \n`;
                    }

                    const votes = new Discord.MessageEmbed()
                        .setAuthor(message.member.user.username, message.member.user.avatarURL())
                        .setTitle("Results of the poll")
                        .setURL(`https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${msgID}`)
                        .setDescription(msgContent)
                        .setColor("#00BFFF")
                        .setFooter(Client.user.username, Client.user.avatarURL())

                    message.channel.send({ embeds: [votes] });
                });
        }
    }
}
