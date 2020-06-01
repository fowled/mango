import * as Discord from "discord.js";
import * as fs from "fs";

// Fun command

/**
 * Re-creating the hangman game but it's in Discord
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const wordsToFind: string[] = [];
    let data = fs.readFileSync("assets/words.txt", "utf-8");

    for (let word of data.split("\n")) {
        wordsToFind.push(word);
    }

    const thatOneWord: string = wordsToFind[Math.floor(Math.random() * wordsToFind.length)];
    const reactions: string[] = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲'];
    const reactions2: string[] = ['🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
    let guessesNumber: number = 0;
    let guessedLetters: string[] = [];
    let stars: string = "";
    let firstMessageID;
    let secondMessageID;

    replaceWithStars();
    addReactions();

    function addReactions() {
        message.channel.send("> Initializating...").then(async msg => {
            for (let letter of reactions) {
                await msg.react(letter);
            }
            firstMessageID = msg.id;
            createReactionCollector(msg);
        });

        message.channel.send("> Word: ...").then(async msg => {
            for (let char of reactions2) {
                await msg.react(char);
            }
            secondMessageID = msg.id;
            createReactionCollector(msg);
        });
    }

    function createReactionCollector(msg: Discord.Message) {
        const filter: Discord.CollectorFilter = (reaction, user) => {
            return user.id === message.author.id;
        }

        msg.awaitReactions(filter, { max: 1 })
            .then(collected => {
                if (checkLetter(emojiToLetter(collected.first().emoji.name))) {
                    replaceWithStars(emojiToLetter(collected.first().emoji.name));
                    const correctLetter = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .setDescription(`<a:check:690888185084903475> Good job - you just found the \`${emojiToLetter(collected.first().emoji.name)}\` letter!`)
                        .setColor("#3AD919")
                    message.channel.messages.fetch(firstMessageID).then(m => m.edit(correctLetter));

                    const status = new Discord.MessageEmbed()
                        .setDescription(`Word: \`${stars}\``)
                        .setColor("1E90FF")
                    message.channel.messages.fetch(secondMessageID).then(m => m.edit(status));
                } else if (checkLetter(emojiToLetter(collected.first().emoji.name)) == false) {
                    guessesNumber++;
                    const incorrectLetter = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .setDescription(`<a:nocheck:691001377459142718> Wrong letter \`${emojiToLetter(collected.first().emoji.name)}\`. Remaining attempts: **${10 - guessesNumber}**.`)
                        .setColor("#ff0000")
                    message.channel.messages.fetch(firstMessageID).then(m => m.edit(incorrectLetter));
                    guessedLetters.push(emojiToLetter(collected.first().emoji.name));
                }

                if (checkIfWin()) {
                    const youWon = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .setDescription(`GG - you won the game with *${10 - guessesNumber} attempts* left!`)
                        .setColor("#ffff00")
                    return message.channel.messages.fetch(firstMessageID).then(m => m.edit(youWon));
                } else if (guessesNumber >= 10) {
                    const youLost = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL())
                        .setDescription(`You lost! Word was \`${thatOneWord}\`.`)
                        .setColor("#ff0000")
                    return message.channel.messages.fetch(firstMessageID).then(m => m.edit(youLost));
                }

                collected.first().remove();
                createReactionCollector(msg);
            }).catch(err => {
                createReactionCollector(msg);
            });
    }

    function checkLetter(letter) {
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
        if (stars == thatOneWord) {
            return true;
        }
    }

    function emojiToLetter(emoji) {
        var unicodeChars = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
        var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        let index = unicodeChars.indexOf(emoji);
        return chars[index];
    }

}
