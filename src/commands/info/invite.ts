import * as Discord from "discord.js";

// Invite command

/**
 * Answers with a link to invite the bot
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "invite",
    description: "Sends a link to invite the bot to servers",
    category: "info",

    async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
        const invite = new Discord.MessageEmbed()
            .setAuthor(message.member.user.username, message.member.user.displayAvatarURL())
            .setColor("RANDOM")
            .setTitle("Invite the bot")
            .setURL("https://discord.com/oauth2/authorize?client_id=497443144632238090&permissions=8&scope=bot")
            .setDescription("Click [here](https://discord.com/oauth2/authorize?client_id=497443144632238090&permissions=8&scope=bot) to invite the bot.")
            .setFooter(Client.user.username, Client.user.displayAvatarURL())

        message.reply({ embeds: [invite] });
    }
}
