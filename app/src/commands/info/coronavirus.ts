import Discord from "discord.js";
import fetch from "node-fetch";

// Informative command

/**
 * Replies with stats about the COVID-19 epidemic
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "coronavirus",
    description: "Get COVID-19 disease's latest information",
    category: "info",
    options: [
        {
            name: "country",
            type: 3,
            description: "The country you'd like to get information from",
            required: false,
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[]) {
        if (!args[0]) {
            const req = await fetch("https://disease.sh/v2/all").then((res) => res.json());

            const MessageEmbed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL(),
                })
                .setTitle("Coronavirus stats :chart_with_upwards_trend:")
                .setDescription("Find here COVID-19 related information")
                .setColor("#08ABF9")
                .setThumbnail("https://images.emojiterra.com/twitter/v12/512px/1f637.png")
                .addFields(
                    { name: "Cases", value: req.cases.toString() },
                    { name: "Today cases", value: req.todayCases.toString() },
                    { name: "Deaths", value: req.deaths.toString() },
                    { name: "Today deaths", value: req.todayDeaths.toString() },
                    { name: "Recovered", value: req.recovered.toString() },
                    { name: "Critical", value: req.critical.toString() },
                    {
                        name: "Affected countries",
                        value: req.affectedCountries.toString(),
                    },
                )
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.avatarURL(),
                })
                .setTimestamp();

            interaction.editReply({ embeds: [MessageEmbed] });
        } else {
            const req = await fetch(`https://disease.sh/v2/countries/${args[0]}`).then((res) => res.json());

            if (req.message) {
                return interaction.editReply("<:no:835565213322575963> Couldn't find this country!");
            }

            const MessageEmbed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL(),
                }) // country
                .setTitle("Coronavirus stats :chart_with_upwards_trend:")
                .setDescription("Find here COVID-19 related information")
                .setThumbnail(req.countryInfo.flag.toString())
                .setColor("#08ABF9")
                .addFields(
                    { name: "Cases", value: req.cases.toString() },
                    { name: "Today cases", value: req.todayCases.toString() },
                    { name: "Deaths", value: req.deaths.toString() },
                    { name: "Today deaths", value: req.todayDeaths.toString() },
                    { name: "Recovered", value: req.recovered.toString() },
                    { name: "Critical", value: req.critical.toString() },
                )
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.avatarURL(),
                })
                .setTimestamp();

            interaction.editReply({ embeds: [MessageEmbed] });
        }
    },
};
