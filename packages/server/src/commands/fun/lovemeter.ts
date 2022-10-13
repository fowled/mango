import Discord from "discord.js";

// Fun command

/**
 * A love meter between 2 members
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "lovemeter",
    description: "Calculates love % between to users",
    category: "fun",
    options: [
        {
            name: "user",
            type: "USER",
            description: "The user you want to test the command with",
            required: true,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[]) {
        const member = Client.users.cache.get(args[0]);

        const randomNumber = Math.floor(Math.random() * 10) + 1;

        let messageContent = "\n";

        for (let index = 0; index < randomNumber; index++) {
            messageContent += ":revolving_hearts:";
        }

        for (let index = 0; index < 10 - randomNumber; index++) {
            messageContent += ":black_large_square:";
        }

        const lovemeter = new Discord.EmbedBuilder()
            .setTitle("Lovemeter :heart:")
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL()})
            .setColor("#08ABF9")
            .setDescription(`Current __lovemeter__ between you and *${member}*: ${messageContent} \n→ **${randomNumber * 10}**% of love`)
            .setFooter({text: Client.user.username, iconURL: Client.user.avatarURL()})
            .setTimestamp();

        interaction.editReply({embeds: [lovemeter]});
    },
};
