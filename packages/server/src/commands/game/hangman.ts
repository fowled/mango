import Discord from "discord.js";
import fs from "fs";

// Fun command

/**
 * Re-creating the hangman game but it's in Discord
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "hangman",
	description: "Play a hangman game directly from your Discord channel",
	category: "game",

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message) {
		const wordsToFind: string[] = [];
		const data = fs.readFileSync("assets/docs/words.txt", "utf-8");

		for (const word of data.split("\n")) {
			wordsToFind.push(word);
		}

		const thatOneWord = wordsToFind[Math.floor(Math.random() * wordsToFind.length)].trim();
		const guessedLetters: string[] = [];

		let guessesNumber = 0;
		let stars = "";

		const filter = (m: Discord.Message) => m.author.id === interaction.member.user.id;

		replaceWithStars();

		const startEmbed = new Discord.MessageEmbed().setAuthor(interaction.member.user.username, interaction.member.user.avatarURL()).setColor("#1E90FF").setDescription(`Hangman game generated. Try to guess the word. You have 10 guesses. \nWord to find: \`${stars}\``).setFooter(Client.user.username, Client.user.avatarURL());

		await interaction.editReply({ embeds: [startEmbed] }).then(() => {
			createMessageCollector();
		});

		function createMessageCollector() {
			interaction.channel.awaitMessages({ filter, max: 1 }).then((collected) => {
				if (checkLetter(collected.first().content.toLowerCase())) {
					replaceWithStars(collected.first().content.toLowerCase());

					const correctLetter = new Discord.MessageEmbed().setAuthor(interaction.member.user.username, interaction.member.user.avatarURL()).setColor("#1E90FF").setDescription(`Congrats, you found a letter. \`${stars}\``).setFooter(Client.user.username, Client.user.avatarURL());

					interaction.editReply({ embeds: [correctLetter] });
				} else if (checkLetter(collected.first().content.toLowerCase()) === false) {
					guessesNumber++;

					const incorrectLetter = new Discord.MessageEmbed()
						.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
						.setColor("#ff0000")
						.setDescription(`Nope, wrong letter. You have ${10 - guessesNumber} guesses left. \`${stars}\``)
						.setFooter(Client.user.username, Client.user.avatarURL());

					interaction.editReply({ embeds: [incorrectLetter] });

					guessedLetters.push(collected.first().content);
				} else if (checkLetter(collected.first().content.toLowerCase()) === null) {
					guessesNumber++;

					const alreadyFound = new Discord.MessageEmbed().setAuthor(interaction.member.user.username, interaction.member.user.avatarURL()).setColor("#1E90FF").setDescription(`You already found that letter! \`${stars}\``).setFooter(Client.user.username, Client.user.avatarURL());

					interaction.editReply({ embeds: [alreadyFound] });
				}

				if (checkIfWin()) {
					collected.first().delete();
					const youWon = new Discord.MessageEmbed()
						.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
						.setColor("#ffff00")
						.setDescription(`**${interaction.member.user.tag}** You won! Congratulations. :clap: \nAttempts left: *${10 - guessesNumber}* - word found: \`${thatOneWord}\`.`)
						.setFooter(Client.user.username, Client.user.avatarURL());

					return interaction.editReply({ embeds: [youWon] });
				} else if (guessesNumber >= 10) {
					collected.first().delete();

					const youLost = new Discord.MessageEmbed().setAuthor(interaction.member.user.username, interaction.member.user.avatarURL()).setColor("#ff0000").setDescription(`**${interaction.member.user.tag}** I'm sorry, but you lost. \nWord to guess was: \`${thatOneWord}\`.`).setFooter(Client.user.username, Client.user.avatarURL());

					return interaction.editReply({ embeds: [youLost] });
				} else {
					collected.first().delete();

					createMessageCollector();
				}
			});
		}

		function replaceWithStars(letter?: string) {
			if (guessedLetters.length === 0) {
				for (let i = 0; i < thatOneWord.length; i++) {
					stars += "*";
				}
			} else {
				let replace = "";

				for (let i = 0; i < thatOneWord.length; i++) {
					if (thatOneWord.split("")[i] === letter) {
						replace += letter;
					} else {
						replace += stars.split("")[i];
					}
				}

				stars = replace;
			}

			return stars;
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

		function checkIfWin() {
			if (stars === thatOneWord) {
				return true;
			}
		}
	},
};
