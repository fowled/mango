import Discord from "discord.js";

import { clientInteractions, supabase } from "index";

import { logCommand } from "utils/sendLog";
import { error } from "utils/logger";

module.exports = {
    name: "interactionCreate",
    execute: async function(Client: Discord.Client, interaction: Discord.BaseInteraction) {
        if (interaction.isButton()) {
            return await interaction.deferUpdate();
        }

        if (!interaction.isChatInputCommand()) return;

        const args = interaction.options.data.filter((data) => data.type !== Discord.ApplicationCommandOptionType.Subcommand).map((opt) => opt.value.toString());
        const command = interaction.commandName;

        if (!interaction.isCommand() && !clientInteractions.has(command)) return;

        const commandInteraction = clientInteractions.get(command);
        const interactionMember = interaction.member as Discord.GuildMember;
        const cachedIds = [];

        if (!(interaction.user.id in cachedIds)) {
            const fetchDBAccount = await supabase.from("users").select("user_id").eq("user_id", interaction.user.id).single();

            if (!fetchDBAccount.data) {
                await supabase.from("users").insert({
                    user_id: interaction.user.id,
                    money: 500,
                    guilds: await fetchCommonServers(),
                    inventory: [],
                });
            } else {
                await supabase.from("users").update({ guilds: await fetchCommonServers() }).like("user_id", interaction.user.id);
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
            error(err);
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

        async function fetchCommonServers() {
            return Client.guilds.cache.filter(async (guild) => {
                return (await guild.members.fetch(interaction.user.id));
            }).map(guild => guild.id);
        }
    },
};
