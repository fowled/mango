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
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    if (!args[0]) {
        const xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let parsedRequest = JSON.parse(this.responseText);

                let MessageEmbed = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatar)
                    .setTitle("Coronavirus stats :chart_with_upwards_trend:")
                    .setDescription("Find here COVID-19 related information")
                    .setColor("#08ABF9")
                    .setThumbnail("https://images.emojiterra.com/twitter/v12/512px/1f637.png")
                    .addField("Cases", parsedRequest.cases)
                    .addField("Today cases", parsedRequest.todayCases)
                    .addField("Deaths", parsedRequest.deaths)
                    .addField("Today deaths", parsedRequest.todayDeaths)
                    .addField("Recovered", parsedRequest.recovered)
                    .addField("Critical", parsedRequest.critical)
                    .addField("Affected countries", parsedRequest.affectedCountries)
                    .setFooter(Client.user.username, Client.user.avatar)
                    .setTimestamp()

                message.channel.send(MessageEmbed);
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
                    .setAuthor(message.author.username, message.author.avatar)
                    .setTitle("Coronavirus stats :chart_with_upwards_trend:")
                    .setDescription("Find here COVID-19 related information")
                    .setThumbnail(parsedRequest.countryInfo.flag)
                    .addField("Cases", parsedRequest.cases)
                    .addField("Today cases", parsedRequest.todayCases)
                    .addField("Deaths", parsedRequest.deaths)
                    .addField("Today deaths", parsedRequest.todayDeaths)
                    .addField("Recovered", parsedRequest.recovered)
                    .addField("Critical", parsedRequest.critical)
                    .setFooter(Client.user.username, Client.user.avatar)
                    .setTimestamp()

                message.channel.send(MessageEmbed);
            } else if (this.readyState == 4 && this.status == 404) {
                message.reply("I didn't find that country. <a:nocheck:691001377459142718>");
            }
        }

        xhttp.open("GET", `https://corona.lmao.ninja/v2/countries/${args[0]}`, true);
        xhttp.send();
    }
}
