import * as Discord from "discord.js";
import * as Logger from "../../utils/Logger";
import { getgid } from "process";

// Fun command

/**
 * Re-creating the tic-tac-toe game but it's in Discord
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    let grid = {};
    let turn = "J1";
    let firstMessageID: string;
    let secondPlayer: Discord.User;

    waitForSecondPlayer();

    function waitForSecondPlayer() {
        const filter = (reaction: any, user: { id: string; }) => {
            return user.id != message.author.id;
        };

        let msgid: string;

        message.channel.send("> Waiting for the 2nd player to approve... (click on the reaction to begin the game)").then(async msg => {
            msgid = msg.id;
            await msg.react("👍🏻");

            setTimeout(function () {
                msg.awaitReactions(filter, { max: 1 })
                    .then(collected => {
                        secondPlayer = collected.first().users.cache.last();
                        message.channel.messages.fetch(msgid).then(msg => msg.edit(`2nd player is **${secondPlayer.tag}**! :smile:`));
                        generateGrid();
                    }).catch(err => {
                        message.channel.messages.fetch(msgid).then(msg => msg.edit("Nobody has clicked the reaction for 30 seconds. Game cancelled."));
                    });
            }, 200);
        });
    }

    function generateGrid() {
        initGrid();
        let emojis = [":one:•:two:•:three:•:four:•:five:•:six:•:seven:"];
        let cases = [":blue_square:•:blue_square:•:blue_square:•:blue_square:•:blue_square:•:blue_square:•:blue_square: \n"];
        let columns = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"];

        const intialization: Discord.MessageEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("RANDOM")
            .setDescription("Game is initializating... please wait a bit.")
            .setTimestamp()
            .setFooter(Client.user.username, Client.user.displayAvatarURL())

        message.channel.send(intialization).then(msg => firstMessageID = msg.id);

        message.channel.send("> I am currently generating the grid. Please wait a bit..").then(async msg => {
            for (let number of columns) {
                await msg.react(number);
            }

            for (let i = 0; i < 5; i++) {
                cases.push(":blue_square:•:blue_square:•:blue_square:•:blue_square:•:blue_square:•:blue_square:•:blue_square: \n");
            }

            await msg.edit(`${cases.join("\n")}`);
            setTimeout(function () {
                createReactionCollector(msg);
            }, 300)
        });
    }

    function initGrid() { // init the grid with a JSON object
        for (let i = 0; i < 8; i++) {
            grid[i] = {};
            for (let x = 0; x < 7; x++) {
                grid[i][x] = {};
                grid[i][x]["occupied"] = false;
                grid[i][x]["player"] = null;
            }
        }
    }

    function createReactionCollector(msg: Discord.Message) {
        const filter: Discord.CollectorFilter = (reaction, user) => {
            return user.id === message.author.id || user.id === secondPlayer.id;
        }

        msg.awaitReactions(filter, { max: 1 })
            .then(collected => {
                if (secondPlayer == collected.first().users.cache.last() && turn != "J2" || message.author == collected.first().users.cache.last() && turn != "J1") { // if this isn't the good turn
                    collected.last().users.remove(collected.first().users.cache.last().id);
                    return createReactionCollector(msg);
                }

                const status = new Discord.MessageEmbed() // updates status of the current game
                    .setAuthor(collected.first().users.cache.last().tag, collected.first().users.cache.last().avatarURL())
                    .setColor("#1E90FF")
                    .setDescription(`**${collected.first().users.cache.last().tag}** reacted with the ${collected.first().emoji.name} emoji.`);

                msg.channel.messages.fetch(firstMessageID).then(msg => msg.edit(status));

                editGrid(msg, collected.first().emoji.name);

                /* if (checkIfWin(turn)) {
                    const status = new Discord.MessageEmbed()
                        .setAuthor(collected.first().users.cache.last().tag, collected.first().users.cache.last().avatarURL())
                        .setColor("#ffff00")
                        .setDescription(`**${collected.first().users.cache.last().tag}** won the game. GG!`);

                    msg.channel.messages.fetch(firstMessageID).then(msg => msg.edit(status));
                    return;
                } else if (checkIfEgality()) {
                    const status = new Discord.MessageEmbed()
                        .setAuthor(collected.first().users.cache.last().tag, collected.first().users.cache.last().avatarURL())
                        .setColor("#1E90FF")
                        .setDescription(`:crossed_swords: Nobody won... That's a draw!`);

                    msg.channel.messages.fetch(firstMessageID).then(msg => msg.edit(status));
                } */

                detectPlayer(); // changes turn
                collected.last().users.remove(collected.first().users.cache.last().id); // removes user reaction
                createReactionCollector(msg); // wait for reaction once the turn is finished
            }).catch(err => {
                createReactionCollector(msg);
            });
    }

    async function editGrid(msg: Discord.Message, emoji: string) {
        let getGrid: string[] = msg.content.split("•");
        let selectEmoji: string = turn == "J1" ? ":red_circle:" : ":yellow_circle:";
        let lastOccupiedCase = checkLastOccupiedCase(parseInt(emojiToLetter(emoji)));
        let lilFormula: number = 7 - lastOccupiedCase;
        let formula: number = parseInt(emojiToLetter(emoji)) + (lastOccupiedCase * 5 - lilFormula);
        let splitContent: string = getGrid[formula].split("\n\n")[1];

        if (getGrid[formula] != ":blue_square:") {
            switch (parseInt(emojiToLetter(emoji))) {
                case 1:
                    selectEmoji = `${splitContent} \n\n${selectEmoji}`;
                    break;

                case 7:
                    selectEmoji = `${selectEmoji} \n\n${splitContent}`;
                    break;
            }
        }


        getGrid[formula] = selectEmoji; // edits the grid

        grid[parseInt(emojiToLetter(emoji)) - 1][lastOccupiedCase].occupied = true;
        grid[parseInt(emojiToLetter(emoji)) - 1][lastOccupiedCase].player = turn;

        await msg.edit(getGrid.join("•")); // sends the new grid
    }

    function checkLastOccupiedCase(table: number) { // checks for the last occupied case of a given table
        for (let i = 6; i > 0; i--) {
            if (!grid[table - 1][i].occupied) {
                return i;
            }
        }
    }

    function detectPlayer() { // changing player, when last turn is finished
        if (turn == "J1") {
            return turn = "J2";
        } else {
            return turn = "J1";
        }
    }

    function checkIfWin(turn: string) {
        let casesToCheck = ["1:1,1:2,1:3,1:4"];

        for (let i = 0; i < casesToCheck.length; i++) {
            let firstCase = casesToCheck[i].split(",")[0].split(":");
            let secondCase = casesToCheck[i].split(",")[1].split(":");
            let thirdCase = casesToCheck[i].split(",")[2].split(":");
            let fourthCase = casesToCheck[i].split(",")[3].split(":");

            if (checkGridCases(firstCase, secondCase, thirdCase, fourthCase, turn)) {
                return true;
            }
        }
    }

    function checkGridCases(a: string[], b: string[], c: string[], d: string[], turn: any) {
        if (grid[a[0][1]].player == turn && grid[b[0][1]].player == turn && grid[c[0][1]].player == turn && grid[d[0][1]].player == turn) {
            return true;
        }
    }

    function checkIfEgality() {
        if (grid[1].occupied == true && grid[2].occupied == true && grid[3].occupied == true && grid[4].occupied == true && grid[5].occupied == true && grid[6].occupied == true && grid[7].occupied == true && grid[8].occupied == true && grid[9].occupied == true) return true;
    }

    function emojiToLetter(emoji: string) { // transforms emoji (reaction) to text
        var unicodeChars = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
        var chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        let index = unicodeChars.indexOf(emoji);
        return chars[index];
    }
}

const info = {
    name: "connect4",
    description: "Play connect4 with a friend, thanks to Mango!",
    category: "game",
    args: "none"
}

export { info };
