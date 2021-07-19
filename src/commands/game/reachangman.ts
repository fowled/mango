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
module.exports = {
    name: "reachangman",
    description: "Play a hangman game with reactions",

    async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
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
            let firstMessageID;
            let secondMessageID;
        
            replaceWithStars();
            addReactions();
        
            function addReactions() {
                message.reply("> Initializating...").then(async msg => {
                    for (let letter of reactions) {
                        await msg.react(letter);
                    }
                    firstMessageID = msg.id;
                    createReactionCollector(msg);
                });
        
                message.reply("> Word: ...").then(async msg => {
                    for (let char of reactions2) {
                        await msg.react(char);
                    }
                    secondMessageID = msg.id;
                    createReactionCollector(msg);
                });
            }
        
            function createReactionCollector(msg: Discord.Message) {
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
                            message.channel.messages.fetch(firstMessageID).then(m => m.edit({ embeds: [correctLetter] }));
        
                            const status = new Discord.MessageEmbed()
                                .setDescription(`Word: \`${stars}\``)
                                .setColor("#1E90FF")
                            message.channel.messages.fetch(secondMessageID).then(m => m.edit({ embeds: [status] }));
                        } else if (checkLetter(emojiToLetter(collected.first().emoji.name)) == false) {
                            guessesNumber++;
                            const incorrectLetter = new Discord.MessageEmbed()
                                .setAuthor(message.member.user.username, message.member.user.avatarURL())
                                .setDescription(`<:no:835565213322575963> Wrong letter \`${emojiToLetter(collected.first().emoji.name)}\`. Remaining attempts: **${10 - guessesNumber}**.`)
                                .setColor("#ff0000")
                            message.channel.messages.fetch(firstMessageID).then(m => m.edit({ embeds: [incorrectLetter] }));
                            guessedLetters.push(emojiToLetter(collected.first().emoji.name));
                        }
        
                        if (checkIfWin()) {
                            const youWon = new Discord.MessageEmbed()
                                .setAuthor(message.member.user.username, message.member.user.avatarURL())
                                .setDescription(`GG - you won the game with *${10 - guessesNumber} attempts* left!`)
                                .setColor("#ffff00")
                            return message.channel.messages.fetch(firstMessageID).then(m => m.edit({ embeds: [youWon] }));
                        } else if (guessesNumber >= 10) {
                            const youLost = new Discord.MessageEmbed()
                                .setAuthor(message.member.user.username, message.member.user.avatarURL())
                                .setDescription(`You lost! Word was \`${thatOneWord}\`.`)
                                .setColor("#ff0000")
                            return message.channel.messages.fetch(firstMessageID).then(m => m.edit({ embeds: [youLost] }));
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
}   
