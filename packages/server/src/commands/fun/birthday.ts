import Discord from "discord.js";

import { timestamp } from "utils/timestamp";

import type { PrismaClient } from "@prisma/client";

// Fun command

/**
 * Birthday module!
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "birthday",
	description: "Adds your birthday to Mango's database",
	category: "fun",
	subcommands: [
		{
			name: "setup",
			description: "Setup the birthday module (admin only)",
			type: 1,
			options: [
				{
					name: "channel",
					type: "CHANNEL",
					description: "The channel you want birthdays in",
					required: true,
				},
			],
		},
		{
			name: "add",
			description: "Adds your birthday",
			type: 1,
			options: [
				{
					name: "date",
					type: "STRING",
					description: "Adds your birthday do the database",
					required: true,
				},
			],
		},
		{
			name: "edit",
			description: "Edits your birthday",
			type: 1,
			options: [
				{
					name: "new_date",
					type: "STRING",
					description: "Edits your birthday do the database",
					required: true,
				},
			],
		},
		{
			name: "delete",
			description: "Deletes your birthday",
			type: 1,
		},
	],

	async execute(_Client: Discord.Client, interaction: Discord.CommandInteraction, _args: string[], prisma: PrismaClient) {
		const birthdayChannel = await prisma.birthdaysChannels.findUnique({ where: { idOfGuild: interaction.guild.id } });
		const fetchBirthdays = await prisma.birthdays.findMany({ where: { idOfUser: interaction.user.id } });
		const fetchGuildBirthday = await prisma.birthdays.findFirst({ where: { idOfGuild: interaction.guild.id, idOfUser: interaction.user.id } });

		if (!birthdayChannel && interaction.options.getSubcommand() !== "setup") {
			return interaction.editReply("Whoops! It looks like the birthday module isn't enabled on this server (yet). An admin must run `/birthday setup` first! :eyes:");
		}

		switch (interaction.options.getSubcommand()) {
			case "setup":
				await setupBirthday();
				break;

			case "add":
				await addBirthday();
				break;

			case "edit":
				await editBirthday();
				break;

			case "delete":
				await deleteBirthday();
				break;
		}

		async function setupBirthday() {
			const channel = interaction.options.getChannel("channel");

			if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
				return interaction.editReply("<:no:835565213322575963> This command is admin-only!");
			} else if (channel.type !== "GUILD_TEXT") {
				return interaction.editReply("The channel you specified isn't a text channel. Please retry the command.");
			}

			if (birthdayChannel) {
				await prisma.birthdaysChannels.update({ where: { idOfGuild: interaction.guild.id }, data: { idOfChannel: channel.id } });
			} else {
				await prisma.birthdaysChannels.create({
					data: {
						idOfGuild: interaction.guild.id,
						idOfChannel: channel.id,
					},
				});
			}

			return interaction.editReply(`<:yes:835565213498736650> Successfully updated the birthday channel to \`#${channel.name}\`!`);
		}

		async function addBirthday() {
			const birthdayTimestamp = Date.parse(interaction.options.getString("date"));

			if (fetchGuildBirthday) {
				return interaction.editReply(`Your birthday has already been added to the database at date ${timestamp(fetchGuildBirthday.birthdayTimestamp)}! If you'd like to change it, run \`/birthday edit\`.`);
			}

			if (isNaN(birthdayTimestamp)) {
				return interaction.editReply("Could not parse the specified string to a date. Please retry the command using this scheme: `MM/DD/YYYY`.");
			}

			const birthdayDate = `${new Date(birthdayTimestamp).getMonth()}/${new Date(birthdayTimestamp).getDate()}`;

			await prisma.birthdays.create({
				data: {
					idOfUser: interaction.user.id,
					birthday: birthdayDate,
					birthdayTimestamp: birthdayTimestamp,
					idOfGuild: interaction.guild.id,
				},
			});

			return interaction.editReply(`:tada: Your birthday has been saved to ${timestamp(birthdayTimestamp)}!`);
		}

		async function editBirthday() {
			if (fetchBirthdays.length === 0) {
				return interaction.editReply("It looks like your birthday is currently not stored in my database. Do `/birthday add` to save it!");
			}

			const newBirthdayTimestamp = Date.parse(interaction.options.getString("new_date"));

			if (isNaN(newBirthdayTimestamp)) {
				return interaction.editReply("Could not parse the specified string to a date. Please retry the command using this scheme: `MM/DD/YYYY` or `MM/DD`.");
			}

			const newBirthdayDate = `${new Date(newBirthdayTimestamp).getMonth()}/${new Date(newBirthdayTimestamp).getDate()}`;

			await prisma.birthdays.updateMany({ where: { idOfUser: interaction.user.id }, data: { birthday: newBirthdayDate, birthdayTimestamp: newBirthdayTimestamp } });

			return interaction.editReply(`:tada: Your birthday has been updated to ${timestamp(newBirthdayTimestamp)}!`);
		}

		async function deleteBirthday() {
			if (fetchBirthdays.length === 0) {
				return interaction.editReply("It looks like your birthday is currently not stored in my database. Do `/birthday add` to save it!");
			}

			fetchBirthdays.forEach(async (birthday) => {
				await prisma.birthdays.deleteMany({ where: { idOfUser: birthday.idOfUser } });
			});

			return interaction.editReply("Your birthday has been deleted from the database. Made a mistake? Add it back with `/birthday add`!");
		}
	},
};
