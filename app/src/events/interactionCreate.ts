import Discord from "discord.js";

import { clientInteractions, supabase, cachedIds } from "index";

import { logCommand } from "utils/sendLog";
import { warn } from "utils/logger";

module.exports = {
    name: "interactionCreate",
    execute: async function (Client: Discord.Client, interaction: Discord.BaseInteraction) {
        if (interaction.isButton()) {
            return await interaction.deferUpdate();
        }

        if (!interaction.isChatInputCommand() || !interaction.isCommand() || !clientInteractions.has(interaction.commandName)) return;

        const args = interaction.options.data.filter((data) => data.type !== Discord.ApplicationCommandOptionType.Subcommand).map((opt) => opt.value.toString());
        const command = interaction.commandName;

        const commandInteraction = clientInteractions.get(command);
        const interactionMember = interaction.member as Discord.GuildMember;
        const cachedIds = [];

        if (!(interaction.user.id in cachedIds)) {
            const fetchDBAccount = await supabase.from("users").select("user_id").eq("user_id", interaction.user.id).single();

            if (!fetchDBAccount.data) {
                await supabase.from("users").insert({
                    user_id: interaction.user.id,
                    money: 500,
                    guilds: await fetchMutualServers(),
                    inventory: [],
                });
            } else {
                await supabase.from("users").update({ guilds: await fetchMutualServers() }).like("user_id", interaction.user.id);
            }

            cachedIds.push(interaction.user.id);
        }

        if (commandInteraction.memberPermissions && !interactionMember.permissions.has(commandInteraction.memberPermissions as Discord.PermissionResolvable)) {
            return interaction.reply({
                content: `<:no:835565213322575963> Sorry, but it looks like you're missing one of the following permissions: \`${commandInteraction.memberPermissions.join(", ")}\``,
                ephemeral: true,
            });
        } else if (commandInteraction.botPermissions && !(await interaction.guild.members.fetchMe()).permissions.has(commandInteraction.botPermissions as Discord.PermissionResolvable)) {
            return interaction.reply({
                content: `<:no:835565213322575963> It looks like I'm missing one of the following permissions: \`${commandInteraction.botPermissions.join(", ")}\``,
                ephemeral: true,
            });
        }

        await interaction.deferReply();

        try {
            await commandInteraction.execute(Client, interaction, args, supabase);
        } catch (err) {
            warn(err);
        }

        if (!cachedIds.includes(interaction.user.id)) {
            await checkAccount();

            cachedIds.push(interaction.user.id);
        }

        const commandEmbed = new Discord.EmbedBuilder()
            .setDescription(`**${interaction.user.tag}** just ran the \`${interaction.commandName}\` command in *${interaction.guild.name}*.`)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setColor("NotQuiteBlack")
            .setTimestamp()
            .setFooter({
                text: Client.user.username,
                iconURL: Client.user.displayAvatarURL(),
            });

        logCommand(Client, commandEmbed);

        async function checkAccount() {
            const fetchDBAccount = await supabase.from("users").select("user_id").eq("user_id", interaction.user.id).single();

            if (!fetchDBAccount.data) {
                await supabase.from("users").insert({
                    user_id: interaction.user.id,
                    money: 500,
                    guilds: await fetchMutualServers(),
                    inventory: [],
                });
            } else {
                await supabase.from("users").update({ guilds: await fetchMutualServers() }).like("user_id", interaction.user.id);
            }
        }

        async function fetchMutualServers() {
            const mutualServers = [];

            await Promise.all(Client.guilds.cache.map(async (g) => {
                try {
                    await g.members.fetch({ user: interaction.user.id });

                    mutualServers.push(g.id);
                } catch (err) { };
            }));

            return mutualServers;
        }
    },
};
