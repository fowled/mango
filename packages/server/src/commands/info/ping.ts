import Discord from "discord.js";

// Ping command

/**
 * Tests the bot ping.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "ping",
    description: "Get info on Mango's latency",
    category: "info",

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction) {
        await interaction.editReply("Ping?");

        const pong = new Discord.EmbedBuilder()
            .setTitle(`Latency information for ${interaction.user.tag}`)
            .setAuthor({name: interaction.user.username, iconURL: interaction.user.avatarURL()})
            .setColor("Random")
            .setDescription("Latency information")
            .addFields({name: "API latency", value: `**${Math.round(Client.ws.ping)}** ms.`})
            .setFooter({text: Client.user.username, iconURL: Client.user.avatarURL()})
            .setTimestamp();

        interaction.editReply({embeds: [pong]});
    },
};
