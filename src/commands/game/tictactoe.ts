import * as Discord from "discord.js";

// Fun command

/**
 * Re-creating the tic-tac-toe game but it's in Discord
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "tictactoe",
    description: "Play a tictactoe game, thanks to Mango",
    category: "game",
    botPermissions: ["ADD_REACTIONS"],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message) {
        const grid = {};
        let turn = "J1";
        let secondPlayer: Discord.User;

        const filter = (reaction: any, user: { id: string; }) => {
            return user.id != interaction.member.user.id;
        };

        interaction.reply("> Waiting for the 2nd player to approve... (click on the reaction to begin the game)").then(() => {
            fetchInteraction();
        });

        function fetchInteraction() {
            interaction.fetchReply().then((msg: Discord.Message & Discord.CommandInteraction) => {
                addReactions(msg);
            });
        }

        async function addReactions(msg: Discord.Message & Discord.CommandInteraction) {
            await msg.react("👍🏻");

            createFirstReactionCollector(msg);
        }

        function createFirstReactionCollector(msg: Discord.Message & Discord.CommandInteraction) {
            msg.awaitReactions({ filter: filter, max: 1 })
                .then(collected => {
                    secondPlayer = collected.first().users.cache.last();
                    msg.editReply(`2nd player is **${secondPlayer.tag}**. Init...`);
                    generateGrid();
                }).catch(() => {
                    msg.editReply("Nobody has clicked the reaction for 30 seconds. Game cancelled.");
                });
        }

        function generateGrid() {
            initGrid();
            let numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

            interaction.editReply("> Status: init :eyes:");

            interaction.channel.send("> I am currently generating the grid. Please wait a bit..").then(async msg => {
                for (const number of numbers) {
                    await msg.react(number);
                }

                numbers = ["1️⃣", "2️⃣", "3️⃣", "\n4️⃣", "5️⃣", "6️⃣", "\n7️⃣", "8️⃣", "9️⃣"];

                await msg.edit(numbers.join(" "));
                setTimeout(function () {
                    createReactionCollector(msg);
                }, 300)
            });
        }

        function initGrid() { // init the grid with a JSON object
            for (let i = 0; i < 10; i++) {
                grid[i] = {};
                grid[i]["occupied"] = false;
                grid[i]["player"] = null;
            }

        }

        function createReactionCollector(msg: Discord.Message) {
            const filter = (reaction: any, user: { id: string; }) => {
                return user.id === interaction.member.user.id || user.id === secondPlayer.id;
            }

            msg.awaitReactions({ filter: filter, max: 1 })
                .then(collected => {
                    if (secondPlayer == collected.first().users.cache.last() && turn != "J2" || interaction.member.user == collected.first().users.cache.last() && turn != "J1") {
                        collected.last().users.remove(collected.first().users.cache.last().id);
                        return createReactionCollector(msg);
                    }

                    if (isCaseOccupied(emojiToLetter(collected.first().emoji.name))) {
                        const status = new Discord.MessageEmbed()
                            .setAuthor(collected.first().users.cache.last().tag, collected.first().users.cache.last().avatarURL())
                            .setColor("#1E90FF")
                            .setDescription(`**${collected.first().users.cache.last().tag}** tried to react with the ${collected.first().emoji.name} emoji, but this case is already occupied by a player...`);

                        interaction.editReply({ embeds: [status] });

                        collected.last().users.remove(collected.first().users.cache.last().id);
                        return createReactionCollector(msg);
                    }

                    const status = new Discord.MessageEmbed()
                        .setAuthor(collected.first().users.cache.last().tag, collected.first().users.cache.last().avatarURL())
                        .setColor("#1E90FF")
                        .setDescription(`**${collected.first().users.cache.last().tag}** reacted with the ${collected.first().emoji.name} emoji.`);

                    interaction.editReply({ embeds: [status] });

                    editGrid(msg, collected.first().emoji.name);

                    if (checkIfWin(turn)) {
                        const status = new Discord.MessageEmbed()
                            .setAuthor(collected.first().users.cache.last().tag, collected.first().users.cache.last().avatarURL())
                            .setColor("#ffff00")
                            .setDescription(`**${collected.first().users.cache.last().tag}** won the game. GG!`);

                        interaction.editReply({ embeds: [status] });
                        return;
                    } else if (checkIfEgality()) {
                        const status = new Discord.MessageEmbed()
                            .setAuthor(collected.first().users.cache.last().tag, collected.first().users.cache.last().avatarURL())
                            .setColor("#1E90FF")
                            .setDescription(`:crossed_swords: Nobody won... That's a draw!`);

                        interaction.editReply({ embeds: [status] });
                    }

                    detectPlayer(); // changes turn
                    collected.last().users.remove(collected.first().users.cache.last().id); // removes user reaction
                    createReactionCollector(msg); // wait for reaction once the turn is finished
                }).catch(() => {
                    createReactionCollector(msg);
                });
        }

        function isCaseOccupied(coords: string) {
            if (grid[coords].occupied) {
                return true;
            } else {
                return false;
            }
        }

        async function editGrid(msg: Discord.Message, emoji: string) {
            const getGrid = msg.content.split(" ");
            const gridToObject = Object.values(getGrid);
            const letterToNumber = parseInt(emojiToLetter(emoji));
            let selectEmoji = turn == "J1" ? ":x:" : ":o:";

            if (gridToObject[letterToNumber - 1].startsWith("\n")) {
                selectEmoji = `\n${selectEmoji}`;
            }

            gridToObject.splice((letterToNumber - 1), 1, selectEmoji);
            grid[parseInt(emojiToLetter(emoji))].occupied = true;
            grid[parseInt(emojiToLetter(emoji))].player = turn;

            await msg.edit(gridToObject.join(" "));
        }

        function detectPlayer() { // changing player, when last turn is finished
            if (turn == "J1") {
                return turn = "J2";
            } else {
                return turn = "J1";
            }
        }

        function checkIfWin(turn: string) {
            const casesToCheck = ["1,2,3", "3,6,9", "9,8,7", "7,4,1", "2,5,8", "7,5,3", "1,5,9", "4,5,6"];

            for (let i = 0; i < casesToCheck.length; i++) {
                const firstCase = casesToCheck[i].split(",")[0];
                const secondCase = casesToCheck[i].split(",")[1];
                const thirdCase = casesToCheck[i].split(",")[2];

                if (checkGridCases(firstCase, secondCase, thirdCase, turn)) {
                    return true;
                }
            }
        }

        function checkIfEgality() {
            if (grid[1].occupied == true && grid[2].occupied == true && grid[3].occupied == true && grid[4].occupied == true && grid[5].occupied == true && grid[6].occupied == true && grid[7].occupied == true && grid[8].occupied == true && grid[9].occupied == true) return true;
        }

        function checkGridCases(a: string, b: string, c: string, turn: any) {
            if (grid[a].player == turn && grid[b].player == turn && grid[c].player == turn) return true;
        }

        function emojiToLetter(emoji: string) { // transforms emoji (reaction) to text
            const unicodeChars = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
            const chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
            const index = unicodeChars.indexOf(emoji);

            return chars[index];
        }
    }
}
