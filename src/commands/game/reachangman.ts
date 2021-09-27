import * as Discord from "discord.js";
import * as fs from "fs";

// Fun command

/**
 * Re-creating the hangman game but it's in Discord
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "reachangman",
    description: "Play a hangman game with reactions",
    category: "game",
    botPermissions: ["ADD_REACTIONS", "MANAGE_MESSAGES"],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message) {
        const wordsToFind: string[] = [];
        const data = fs.readFileSync("assets/docs/words.txt", "utf-8");

        for (const word of data.split("\n")) {
            wordsToFind.push(word);
        }

        const thatOneWord: string = wordsToFind[Math.floor(Math.random() * wordsToFind.length)];
        const reactions: string[] = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲'];
        const reactions2: string[] = ['🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
        let guessesNumber: number = 0;
        const guessedLetters: string[] = [];
        let stars: string = "";
        let secondMessage: Discord.CommandInteraction & Discord.Message;

        replaceWithStars();

        const firstMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
            .setAuthor(interaction.member.user.username, interaction.member.user.displayAvatarURL())
            .setDescription("The game is currently initializating - please wait for the reactions to register.")
            .setColor("#1E90FF")
        interaction.editReply({ embeds: [firstMessageEmbed] }).then(() => {
            fetchInteraction()
        });

        function fetchInteraction() {
            interaction.fetchReply().then((msg: Discord.Message & Discord.CommandInteraction) => {
                addReactions(msg);
            });
        }

        async function addReactions(firstmsg: Discord.Message & Discord.CommandInteraction) {
            for (const char of reactions) {
                firstmsg.react(char);
            }

            const statusMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
                .setDescription(`Word: \`${stars}\``)
                .setColor("#1E90FF")
            interaction.channel.send({ embeds: [statusMessageEmbed] }).then(async (msg: Discord.Message & Discord.CommandInteraction) => {
                for (const char of reactions2) {
                    await msg.react(char);
                }

                secondMessage = msg;

                applyReactionCollectors();
            });
        }

        async function applyReactionCollectors() {
            for (let i = 0; i < arguments.length; i++) {
                createReactionCollector(arguments[i]);
            }
        }

        function createReactionCollector(msg: Discord.Message & Discord.CommandInteraction) {
            const filter = (reaction, user) => {
                return user.id === interaction.member.user.id;
            }

            msg.awaitReactions({ filter, max: 1 })
                .then(collected => {
                    if (checkLetter(emojiToLetter(collected.first().emoji.name))) {
                        replaceWithStars(emojiToLetter(collected.first().emoji.name));
                        const correctLetter = new Discord.MessageEmbed()
                            .setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                            .setDescription(`<:yes:835565213498736650> Good job - you just found the \`${emojiToLetter(collected.first().emoji.name)}\` letter!`)
                            .setColor("#3AD919")
                        interaction.editReply({ embeds: [correctLetter] });

                        const status = new Discord.MessageEmbed()
                            .setDescription(`Word: \`${stars}\``)
                            .setColor("#1E90FF")
                        secondMessage.edit({ embeds: [status] });
                    } else if (checkLetter(emojiToLetter(collected.first().emoji.name)) == false) {
                        guessesNumber++;
                        const incorrectLetter = new Discord.MessageEmbed()
                            .setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                            .setDescription(`<:no:835565213322575963> Wrong letter \`${emojiToLetter(collected.first().emoji.name)}\`. Remaining attempts: **${10 - guessesNumber}**.`)
                            .setColor("#ff0000")
                        interaction.editReply({ embeds: [incorrectLetter] });
                        guessedLetters.push(emojiToLetter(collected.first().emoji.name));
                    }

                    if (checkIfWin()) {
                        const youWon = new Discord.MessageEmbed()
                            .setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                            .setDescription(`GG - you won the game with *${10 - guessesNumber} attempts* left!`)
                            .setColor("#ffff00")
                        return interaction.editReply({ embeds: [youWon] });
                    } else if (guessesNumber >= 10) {
                        const youLost = new Discord.MessageEmbed()
                            .setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                            .setDescription(`You lost! Word was \`${thatOneWord}\`.`)
                            .setColor("#ff0000")
                        return interaction.editReply({ embeds: [youLost] });
                    }

                    collected.first().remove();
                    createReactionCollector(msg);
                }).catch(() => {
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
            const unicodeChars = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
            const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            const index = unicodeChars.indexOf(emoji);

            return chars[index];
        }
    }
}
