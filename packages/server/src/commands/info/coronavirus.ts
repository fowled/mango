import Discord from "discord.js";
import fetch from "node-fetch";

// Informative command

/**
 * Replies with stats about the COVID-19 epidemic
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
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
			type: "STRING",
			description: "The country you'd like to get information from",
			required: false,
		},
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
		if (!args[0]) {
			const req = await fetch("https://disease.sh/v2/all").then((res) => res.json());

			console.log(req);

			const MessageEmbed = new Discord.MessageEmbed()
				.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL()) // global
				.setTitle("Coronavirus stats :chart_with_upwards_trend:")
				.setDescription("Find here COVID-19 related information")
				.setColor("#08ABF9")
				.setThumbnail("https://images.emojiterra.com/twitter/v12/512px/1f637.png")
				.addField("Cases", req.cases.toString())
				.addField("Today cases", req.todayCases.toString())
				.addField("Deaths", req.deaths.toString())
				.addField("Today deaths", req.todayDeaths.toString())
				.addField("Recovered", req.recovered.toString())
				.addField("Critical", req.critical.toString())
				.addField("Affected countries", req.affectedCountries.toString())
				.setFooter(Client.user.username, Client.user.avatarURL())
				.setTimestamp();

			interaction.editReply({ embeds: [MessageEmbed] });
		} else {
			const req = await fetch(`https://disease.sh/v2/countries/${args[0]}`).then((res) => res.json());

			if (req.message) {
				return interaction.editReply("<:no:835565213322575963> Couldn't find this country!");
			}

			const MessageEmbed = new Discord.MessageEmbed()
				.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL()) // country
				.setTitle("Coronavirus stats :chart_with_upwards_trend:")
				.setDescription("Find here COVID-19 related information")
				.setThumbnail(req.countryInfo.flag.toString())
				.setColor("#08ABF9")
				.addField("Cases", req.cases.toString())
				.addField("Today cases", req.todayCases.toString())
				.addField("Deaths", req.deaths.toString())
				.addField("Today deaths", req.todayDeaths.toString())
				.addField("Recovered", req.recovered.toString())
				.addField("Critical", req.critical.toString())
				.setFooter(Client.user.username, Client.user.avatarURL())
				.setTimestamp();

			interaction.editReply({ embeds: [MessageEmbed] });
		}
	},
};
