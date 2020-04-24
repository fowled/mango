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
    let guessesNumber: number = 0;
    let guessedLetters: string[] = [];
    let stars: string = "";
    let messageID;

    const filter: Discord.CollectorFilter = m => m.author.id === message.author.id;

    replaceWithStars();

    const startEmbed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setColor("#1E90FF")
        .setDescription(`Hangman game generated. Try to guess the word. You have 10 guesses. \nWord to find: \`${stars}\``)
        .setFooter(Client.user.username, Client.user.avatarURL)

    await message.channel.send(startEmbed).then(m => {
        messageID = m.id;
    });

    createMessageCollector();

    function createMessageCollector() {
        message.channel.awaitMessages(filter, { max: 1 }).then((collected) => {
            if (checkLetter(collected.first().content)) {
                replaceWithStars(collected.first().content);
                const correctLetter = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setColor("#1E90FF")
                    .setDescription(`Congrats, you found a letter. \`${stars}\``)
                    .setFooter(Client.user.username, Client.user.avatarURL)
                message.channel.fetchMessage(messageID).then(m => m.edit(correctLetter));
            } else if (checkLetter(collected.first().content) == false) {
                guessesNumber++;
                const incorrectLetter = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setColor("#ff0000")
                    .setDescription(`Nope, wrong letter. You have ${10 - guessesNumber} guesses left. \`${stars}\``)
                    .setFooter(Client.user.username, Client.user.avatarURL)
                message.channel.fetchMessage(messageID).then(m => m.edit(incorrectLetter));
                guessedLetters.push(collected.first().content);
            } else if (checkLetter(collected.first().content) == null) {
                guessesNumber++;
                const alreadyFound = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setColor("#1E90FF")
                    .setDescription(`You already found that letter! \`${stars}\``)
                    .setFooter(Client.user.username, Client.user.avatarURL)
                message.channel.fetchMessage(messageID).then(m => m.edit(alreadyFound));
            }

            if (checkIfWin()) {
                collected.first().delete();
                const youWon = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setColor("#ffff00")
                    .setDescription(`**${message.author.tag}** You won! Congratulations. :clap: \nAttempts left: *${10 - guessesNumber}* - word found: \`${thatOneWord}\`.`)
                    .setFooter(Client.user.username, Client.user.avatarURL)
                return message.channel.fetchMessage(messageID).then(m => m.edit(youWon));
            } else if (guessesNumber >= 10) {
                collected.first().delete();
                const youLost = new Discord.RichEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setColor("#ff0000")
                    .setDescription(`**${message.author.tag}** I'm sorry, but you lost. \nWord to guess was: \`${thatOneWord}\`.`)
                    .setFooter(Client.user.username, Client.user.avatarURL)
                return message.channel.fetchMessage(messageID).then(m => m.edit(youLost));
            } else {
                collected.first().delete();
                createMessageCollector();
            }

        }).catch(() => {
            createMessageCollector();
        });
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

    function checkIfWin() {
        if (stars == thatOneWord) {
            return true;
        }
    }
}
