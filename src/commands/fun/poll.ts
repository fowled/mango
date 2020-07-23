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
export async function run(Client: Discord.Client, message: Discord.Message, args: string, options: any) {
    const time = message.content.split("poll")[1].trim().split(" | ")[0];

    let splitMessage = message.content.split(`${time} |`)[1].split(" | ");
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
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle(`Poll by **${message.author.tag}**`)
        .setDescription(choices.join("\n"))
        .setColor("#00BFFF")
        .setFooter(Client.user.username, Client.user.avatarURL())

    message.channel.send(poll).then(async msg => {
        for (let i = 0; i < splitMessage.length; i++) {
            await msg.react(reactions[i]);
        }

        msgID = msg.id;

        setTimeout(function () {
            createReactionCollector(msg);
        }, 300);
    });

    function createReactionCollector(msg: Discord.Message) {
        const filter = (reaction, user) => {
            return ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"].includes(reaction.emoji.name);
        };

        msg.awaitReactions(filter, { time: ms(time), errors: ["time"] })
            .then((collected: Discord.Collection<string, Discord.MessageReaction>) => {
            }).catch((collected: Discord.Collection<string, Discord.MessageReaction>) => {
                let msg = "";
                let numberOfReactions = 0;

                message.channel.messages.fetch(msgID).then(mess => {
                    for (var i = 0; i < splitMessage.length; i++) {
                        numberOfReactions += (mess.reactions.cache.array()[i].users.cache.size - 1);
                    }

                    for (var x = 0; x < splitMessage.length; x++) {
                        msg += `${reactions[x]} - ${splitMessage[x]} - ${mess.reactions.cache.array()[x].count - 1} votes **[${Math.round((mess.reactions.cache.array()[x].count - 1) / numberOfReactions * 100)}%]** \n`;
                    }

                    const votes = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .setTitle("Results of the poll")
                        .setURL(`https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${msgID}`)
                        .setDescription(msg)
                        .setColor("#00BFFF")
                        .setFooter(Client.user.username, Client.user.avatarURL())

                    message.channel.send(votes);
                });
            });
    }

    function emojiToLetter(emoji) { // transforms emoji (reaction) to text
        var unicodeChars = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];
        var chars = ["1", "2", "3", "4", "5"];
        let index = unicodeChars.indexOf(emoji);
        return chars[index];
    }

}

const info = {
    name: "poll",
    description: "Create a poll",
    category: "fun",
    args: "[duration] | [Option 1] | [Up to 5 options]"
}

export { info };
