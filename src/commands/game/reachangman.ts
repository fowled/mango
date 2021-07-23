import * as Discord from "discord.js";
import * as fs from "fs";
import { replyMsg } from "../../utils/InteractionAdapter";

// Fun command

/**
 * Re-creating the hangman game but it's in Discord
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "reachangman",
    description: "Play a hangman game with reactions",
    category: "game",

    async execute(Client: Discord.Client, message: Discord.Message & Discord.CommandInteraction, args: any, ops: any) {
        const wordsToFind: string[] = [];
        let data = fs.readFileSync("assets/docs/words.txt", "utf-8");

        for (let word of data.split("\n")) {
            wordsToFind.push(word);
        }

        const thatOneWord: string = wordsToFind[Math.floor(Math.random() * wordsToFind.length)];
        const reactions: string[] = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲'];
        const reactions2: string[] = ['🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
        let guessesNumber: number = 0;
        let guessedLetters: string[] = [];
        let stars: string = "";
        let firstMessage: Discord.Message & Discord.CommandInteraction, secondMessage: Discord.Message & Discord.CommandInteraction;

        replaceWithStars();

        const firstMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
            .setAuthor(message.member.user.username, message.member.user.displayAvatarURL())
            .setDescription("The game is currently initializating - please wait for the reactions to register.")
            .setColor("#1E90FF")
        message.reply({ embeds: [firstMessageEmbed] }).then(async (msg: Discord.Message & Discord.CommandInteraction) => {
            (message.type === "APPLICATION_COMMAND") ? fetchInteraction() : addReactions(msg);
        });

        function fetchInteraction() {
            message.fetchReply().then((msg: Discord.Message & Discord.CommandInteraction) => {
                addReactions(msg);
            });
        }

        async function addReactions(firstmsg: Discord.Message & Discord.CommandInteraction) {
            for (let char of reactions) {
                firstmsg.react(char);
            }

            const statusMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
                .setDescription(`Word: \`${stars}\``)
                .setColor("#1E90FF")
            message.channel.send({ embeds: [statusMessageEmbed] }).then(async (msg: Discord.Message & Discord.CommandInteraction) => {
                for (let char of reactions2) {
                    await msg.react(char);
                }

                firstMessage = firstmsg;
                secondMessage = msg;

                applyReactionCollectors(firstmsg, msg);
            });
        }

        async function applyReactionCollectors(firstMessage: Discord.Message & Discord.CommandInteraction, secondMessage: Discord.Message & Discord.CommandInteraction) {
            for (let i = 0; i < arguments.length; i++) {
                createReactionCollector(arguments[i]);
            }
        }

        function createReactionCollector(msg: Discord.Message & Discord.CommandInteraction) {
            const filter: (reaction: any, user: any) => boolean = (reaction, user) => {
                return user.id === message.member.user.id;
            }

            msg.awaitReactions({ filter, max: 1 })
                .then(collected => {
                    if (checkLetter(emojiToLetter(collected.first().emoji.name))) {
                        replaceWithStars(emojiToLetter(collected.first().emoji.name));
                        const correctLetter = new Discord.MessageEmbed()
                            .setAuthor(message.member.user.username, message.member.user.avatarURL())
                            .setDescription(`<:yes:835565213498736650> Good job - you just found the \`${emojiToLetter(collected.first().emoji.name)}\` letter!`)
                            .setColor("#3AD919")
                        replyMsg(message, { embeds: [correctLetter] }, firstMessage, true);

                        const status = new Discord.MessageEmbed()
                            .setDescription(`Word: \`${stars}\``)
                            .setColor("#1E90FF")
                        replyMsg(message, { embeds: [status] }, secondMessage, false);
                    } else if (checkLetter(emojiToLetter(collected.first().emoji.name)) == false) {
                        guessesNumber++;
                        const incorrectLetter = new Discord.MessageEmbed()
                            .setAuthor(message.member.user.username, message.member.user.avatarURL())
                            .setDescription(`<:no:835565213322575963> Wrong letter \`${emojiToLetter(collected.first().emoji.name)}\`. Remaining attempts: **${10 - guessesNumber}**.`)
                            .setColor("#ff0000")
                        replyMsg(message, { embeds: [incorrectLetter] }, firstMessage, true);
                        guessedLetters.push(emojiToLetter(collected.first().emoji.name));
                    }

                    if (checkIfWin()) {
                        const youWon = new Discord.MessageEmbed()
                            .setAuthor(message.member.user.username, message.member.user.avatarURL())
                            .setDescription(`GG - you won the game with *${10 - guessesNumber} attempts* left!`)
                            .setColor("#ffff00")
                        return replyMsg(message, { embeds: [youWon] }, firstMessage, true);
                    } else if (guessesNumber >= 10) {
                        const youLost = new Discord.MessageEmbed()
                            .setAuthor(message.member.user.username, message.member.user.avatarURL())
                            .setDescription(`You lost! Word was \`${thatOneWord}\`.`)
                            .setColor("#ff0000")
                        return replyMsg(message, { embeds: [youLost] }, firstMessage, true);
                    }

                    collected.first().remove();
                    createReactionCollector(msg);
                }).catch(err => {
                    createReactionCollector(msg);
                });
        }

        function checkLetter(letter: string) {
            if (!guessedLetters.includes(letter) && thatOneWord.split("").includes(letter)) {
                guessedLetters.push(letter);
                return true;
            } else if (guessedLetters.includes(letter)) {
                return null;
            } else {
                return false;
            }
        }


        function replaceWithStars(letter?) {
            if (guessedLetters.length == 0) {
                for (let i = 0; i < thatOneWord.length; i++) {
                    stars += "*";
                }
            } else {
                let test = "";
                for (let i = 0; i < thatOneWord.length; i++) {
                    if (thatOneWord.split("")[i] == letter) {
                        test += letter;
                    } else {
                        test += stars.split("")[i];
                    }
                }
                stars = test;
            }
            return stars;
        }

        function checkIfWin() {
            if (stars == thatOneWord) return true;
        }

        function emojiToLetter(emoji: string) {
            var unicodeChars = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
            var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            let index = unicodeChars.indexOf(emoji);
            return chars[index];
        }
    }
}   
