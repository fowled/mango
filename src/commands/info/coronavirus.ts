import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest";

// Informative command

/**
 * Replies with stats about the COVID-19 epidemic
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
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
            required: false
        }
    ],

    async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
        if (!args[0]) {
            const xhttp: XMLHttpRequest = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let parsedRequest = JSON.parse(this.responseText);

                    let MessageEmbed = new Discord.MessageEmbed()
                        .setAuthor(message.member.user.username, message.member.user.avatarURL())
                        .setTitle("Coronavirus stats :chart_with_upwards_trend:")
                        .setDescription("Find here COVID-19 related information")
                        .setColor("#08ABF9")
                        .setThumbnail("https://images.emojiterra.com/twitter/v12/512px/1f637.png")
                        .addField("Cases", parsedRequest.cases.toString())
                        .addField("Today cases", parsedRequest.todayCases.toString())
                        .addField("Deaths", parsedRequest.deaths.toString())
                        .addField("Today deaths", parsedRequest.todayDeaths.toString())
                        .addField("Recovered", parsedRequest.recovered.toString())
                        .addField("Critical", parsedRequest.critical.toString())
                        .addField("Affected countries", parsedRequest.affectedCountries.toString())
                        .setFooter(Client.user.username, Client.user.avatarURL())
                        .setTimestamp()

                    message.reply({ embeds: [MessageEmbed] });
                }
            }

            xhttp.open("GET", "https://corona.lmao.ninja/v2/all", true);
            xhttp.send();
        } else {
            const xhttp: XMLHttpRequest = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let parsedRequest = JSON.parse(this.responseText);

                    let MessageEmbed = new Discord.MessageEmbed()
                        .setAuthor(message.member.user.username, message.member.user.avatarURL())
                        .setTitle("Coronavirus stats :chart_with_upwards_trend:")
                        .setDescription("Find here COVID-19 related information")
                        .setThumbnail(parsedRequest.countryInfo.flag.toString())
                        .setColor("#08ABF9")
                        .addField("Cases", parsedRequest.cases.toString())
                        .addField("Today cases", parsedRequest.todayCases.toString())
                        .addField("Deaths", parsedRequest.deaths.toString())
                        .addField("Today deaths", parsedRequest.todayDeaths.toString())
                        .addField("Recovered", parsedRequest.recovered.toString())
                        .addField("Critical", parsedRequest.critical.toString())
                        .setFooter(Client.user.username, Client.user.avatarURL())
                        .setTimestamp()

                    message.reply({ embeds: [MessageEmbed] });
                } else if (this.readyState == 4 && this.status == 404) {
                    message.reply("I didn't find that country. <:no:835565213322575963>");
                }
            }

            xhttp.open("GET", `https://corona.lmao.ninja/v2/countries/${args[0]}`, true);
            xhttp.send();
        }
    }
}
