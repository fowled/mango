import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest";
import * as dotenv from "dotenv";
dotenv.config();

// Fun command

/**
 * Replies with the weather of the specified country
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const xhttp: XMLHttpRequest = new XMLHttpRequest();
    const country: string = args[0];

    if (!country) {
        return message.reply("You must specify a country to show its weather.");
    }

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let parsedRequest = JSON.parse(this.responseText);
            let temperature = parsedRequest.main.temp;
            let wind = parsedRequest.wind.speed;
            let icon = `https://openweathermap.org/img/wn/${parsedRequest.weather[0].icon}@2x.png`;

            let richembed = new Discord.RichEmbed()
                .setTitle(`Weather in ${country}`)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setThumbnail(icon)
                .setDescription(`Weather info about a country`)
                .addField("Temperature", `${Math.round(temperature - 273.5)}°C`)
                .addField("Humidity", `${parsedRequest.main.humidity}%`)
                .addField("Wind", `${Math.round(wind * 3.5)} km/h`)
                .addField("Description", `${parsedRequest.weather[0].description}`)
                .setFooter(Client.user.username, Client.user.avatarURL)

            message.channel.send(richembed);
        } else if (this.readyState == 4 && this.status == 404) {
            return message.reply("I'm sorry but I didn't find the country you requested.");
        }
    };

    xhttp.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${process.env.API_KEY}`, true);
    xhttp.send();
}
