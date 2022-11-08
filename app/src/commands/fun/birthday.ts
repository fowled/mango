import Discord from "discord.js";

import { timestamp } from "utils/timestamp";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "interfaces/DB";

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

    async execute(_Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, _args: string[], supabase: SupabaseClient<Database>) {
        const birthdayChannel = await supabase.from("guilds").select("birthdays").like("guild_id", interaction.guild.id).single();
        const fetchGuildBirthday = await supabase.from("users").select().like("user_id", interaction.member.user.id).single();

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

            if (!interaction.memberPermissions.has("Administrator")) {
                return interaction.editReply("<:no:835565213322575963> This command is admin-only!");
            } else if (channel.type !== Discord.ChannelType.GuildText) {
                return interaction.editReply("The channel you specified isn't a text channel. Please retry the command.");
            }

            await supabase.from("guilds").update({ birthdays: channel.id }).like("guild_id", interaction.guild.id);

            return interaction.editReply(`<:yes:835565213498736650> Successfully updated the birthday channel to \`#${channel.name}\`!`);
        }

        async function addBirthday() {
            const birthdayTimestamp = new Date(interaction.options.getString("date"));
            const parseSavedDate = new Date(fetchGuildBirthday.data.birthday).getTime();

            if (birthdayTimestamp.getTimezoneOffset() === -60) {
                birthdayTimestamp.setHours(1);
            }

            if (fetchGuildBirthday.data.birthday) {
                return interaction.editReply(`Your birthday has already been added to the database at date ${timestamp(parseSavedDate)}! If you'd like to change it, run \`/birthday edit\`.`);
            }

            if (isNaN(birthdayTimestamp.getTime())) {
                return interaction.editReply("Could not parse the specified string to a date. Please retry the command using this scheme: `MM/DD/YYYY`.");
            }

            await supabase.from("users").update({ birthday: birthdayTimestamp.toLocaleDateString() }).like("user_id", interaction.user.id);

            return interaction.editReply(`:tada: Your birthday has been saved to ${timestamp(birthdayTimestamp.getTime())}!`);
        }

        async function editBirthday() {
            if (!fetchGuildBirthday.data.birthday) {
                return interaction.editReply("It looks like your birthday is currently not stored in my database. Do `/birthday add` to save it!");
            }

            const newBirthdayTimestamp = new Date(interaction.options.getString("new_date"));

            if (newBirthdayTimestamp.getTimezoneOffset() === -60) {
                newBirthdayTimestamp.setHours(1);
            }

            if (isNaN(newBirthdayTimestamp.getTime())) {
                return interaction.editReply("Could not parse the specified string to a date. Please retry the command using this scheme: `MM/DD/YYYY` or `MM/DD`.");
            }

            await supabase.from("users").update({ birthday: newBirthdayTimestamp.toLocaleDateString() }).like("user_id", interaction.user.id);

            return interaction.editReply(`:tada: Your birthday has been updated to ${timestamp(newBirthdayTimestamp.getTime())}!`);
        }

        async function deleteBirthday() {
            if (!fetchGuildBirthday.data.birthday) {
                return interaction.editReply("It looks like your birthday is currently not stored in my database. Do `/birthday add` to save it!");
            }

            await supabase.from("users").update({ birthday: null }).like("user_id", interaction.user.id);

            return interaction.editReply("Your birthday has been deleted from the database. Made a mistake? Add it back with `/birthday add`!");
        }
    },
};
