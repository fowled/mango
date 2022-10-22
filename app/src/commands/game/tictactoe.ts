import Discord, { MessageReaction } from "discord.js";

// Fun command

/**
 * Re-creating the tic-tac-toe game but it's in Discord
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "tictactoe",
    description: "Play a tictactoe game, thanks to Mango",
    category: "game",
    botPermissions: ["AddReactions"],

    async execute(_Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction) {
        const grid = {};
        let turn = "J1";
        let secondPlayer: Discord.User;

        const filter = (reaction: MessageReaction, user: { id: string }) => {
            return user.id !== interaction.user.id;
        };

        interaction.editReply("> Waiting for the 2nd player to approve... (click on the reaction to begin the game)").then(() => {
            fetchInteraction();
        });

        function fetchInteraction() {
            interaction.fetchReply().then((msg: Discord.Message & Discord.CommandInteraction) => {
                addReactions(msg);
            });
        }

        async function addReactions(msg: Discord.Message) {
            await msg.react("👍🏻");

            createFirstReactionCollector(msg);
        }

        function createFirstReactionCollector(msg: Discord.Message) {
            msg.awaitReactions({ filter: filter, max: 1 })
                .then((collected) => {
                    secondPlayer = collected.first().users.cache.last();
                    interaction.editReply(`2nd player is **${secondPlayer.tag}**. Init...`);
                    generateGrid();
                })
                .catch(() => {
                    interaction.editReply("Nobody has clicked the reaction for 30 seconds. Game cancelled.");
                });
        }

        function generateGrid() {
            initGrid();
            let numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

            interaction.editReply("> Status: init :eyes:");

            interaction.channel.send("> I am currently generating the grid. Please wait a bit..").then(async (msg) => {
                for (const number of numbers) {
                    await msg.react(number);
                }

                numbers = [":one:", ":two:", ":three:", "\n:four:", ":five:", ":six:", "\n:seven:", ":eight:", ":nine:"];

                await msg.edit(numbers.join(" ")).then(() => {
                    createReactionCollector(msg);
                });
            });
        }

        function initGrid() {
            // init the grid with a JSON object
            for (let i = 0; i < 10; i++) {
                grid[i] = {};
                grid[i]["occupied"] = false;
                grid[i]["player"] = null;
            }
        }

        function createReactionCollector(msg: Discord.Message) {
            const filter = (_reaction: MessageReaction, user: { id: string }) => {
                return user.id === interaction.user.id || user.id === secondPlayer.id;
            };

            msg.awaitReactions({ filter: filter, max: 1 })
                .then(async (collected) => {
                    if ((secondPlayer === collected.first().users.cache.last() && turn !== "J2") || (interaction.user === collected.first().users.cache.last() && turn !== "J1")) {
                        collected.last().users.remove(collected.first().users.cache.last().id);
                        return createReactionCollector(msg);
                    }

                    if (isCaseOccupied(emojiToLetter(collected.first().emoji.name))) {
                        const status = new Discord.EmbedBuilder()
                            .setAuthor({
                                name: collected.first().users.cache.last().tag,
                                iconURL: collected.first().users.cache.last().avatarURL(),
                            })
                            .setColor("#1E90FF")
                            .setDescription(`**${collected.first().users.cache.last().tag}** tried to react with the ${collected.first().emoji.name} emoji, but this case is already occupied by a player...`);

                        interaction.editReply({ embeds: [status] });

                        collected.last().users.remove(collected.first().users.cache.last().id);
                        return createReactionCollector(msg);
                    }

                    const status = new Discord.EmbedBuilder()
                        .setAuthor({
                            name: collected.first().users.cache.last().tag,
                            iconURL: collected.first().users.cache.last().avatarURL(),
                        })
                        .setColor("#1E90FF")
                        .setDescription(`**${collected.first().users.cache.last().tag}** reacted with the ${collected.first().emoji.name} emoji.`);

                    interaction.editReply({ embeds: [status] });

                    await editGrid(msg, collected.first().emoji.name);

                    if (checkIfWin(turn)) {
                        const status = new Discord.EmbedBuilder()
                            .setAuthor({
                                name: collected.first().users.cache.last().tag,
                                iconURL: collected.first().users.cache.last().avatarURL(),
                            })
                            .setColor("#ffff00")
                            .setDescription(`**${collected.first().users.cache.last().tag}** won the game. GG!`);

                        interaction.editReply({ embeds: [status] });
                    } else if (checkIfEgality()) {
                        const status = new Discord.EmbedBuilder()
                            .setAuthor({
                                name: collected.first().users.cache.last().tag,
                                iconURL: collected.first().users.cache.last().avatarURL(),
                            })
                            .setColor("#1E90FF")
                            .setDescription(":crossed_swords: Nobody won... That's a draw!");

                        interaction.editReply({ embeds: [status] });
                    }

                    detectPlayer();

                    collected.last().users.remove(collected.first().users.cache.last().id);

                    createReactionCollector(msg);
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        function isCaseOccupied(coords: string) {
            return !!grid[coords].occupied;
        }

        async function editGrid(msg: Discord.Message, emoji: string) {
            const getGrid = (await msg.fetch()).content.split(" ");
            const gridToObject = Object.values(getGrid);
            const letterToNumber = parseInt(emojiToLetter(emoji));

            let selectEmoji = turn === "J1" ? ":x:" : ":o:";

            if (gridToObject[letterToNumber - 1].startsWith("\n")) {
                selectEmoji = `\n${selectEmoji}`;
            }

            gridToObject.splice(letterToNumber - 1, 1, selectEmoji);
            grid[parseInt(emojiToLetter(emoji))].occupied = true;
            grid[parseInt(emojiToLetter(emoji))].player = turn;

            await msg.edit(gridToObject.join(" "));
        }

        function detectPlayer() {
            if (turn === "J1") {
                return (turn = "J2");
            } else {
                return (turn = "J1");
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
            if (grid[1].occupied && grid[2].occupied && grid[3].occupied && grid[4].occupied && grid[5].occupied && grid[6].occupied && grid[7].occupied && grid[8].occupied && grid[9].occupied) return true;
        }

        function checkGridCases(a: string, b: string, c: string, turn: string) {
            if (grid[a].player === turn && grid[b].player === turn && grid[c].player === turn) return true;
        }

        function emojiToLetter(emoji: string) {
            const unicodeChars = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
            const chars = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
            const index = unicodeChars.indexOf(emoji);

            return chars[index];
        }
    },
};
