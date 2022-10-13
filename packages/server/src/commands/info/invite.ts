import Discord from "discord.js";

// Invite command

/**
 * Answers with a link to invite the bot
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "invite",
    description: "Sends a link to invite the bot to servers",
    category: "info",

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction) {
        const button = new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
            .addComponents(new Discord.ButtonBuilder()
                .setLabel("Invite me!")
                .setStyle(Discord.ButtonStyle.Link)
                .setURL("https://discord.com/oauth2/authorize?client_id=497443144632238090&permissions=8&scope=bot"));

        const invite = new Discord.EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setColor("Random")
            .setTitle("Invite the bot")
            .setURL("https://discord.com/oauth2/authorize?client_id=497443144632238090&permissions=8&scope=bot")
            .setDescription("Click [here](https://discord.com/oauth2/authorize?client_id=497443144632238090&permissions=8&scope=bot) to invite the bot (or on the fancy button)")
            .setFooter({text: Client.user.username, iconURL: Client.user.displayAvatarURL()});

        interaction.editReply({embeds: [invite], components: [button]});
    },
};
