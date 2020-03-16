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
            message.reply(`Current temperature in *${country}*: **${Math.round(temperature - 273.5)}**°C.\n`);
        } else if (this.readyState == 4 && this.status == 404) {
            return message.reply("I'm sorry but I didn't find the country you requested.");
        }
    };

    xhttp.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${process.env.API_KEY}`, true);
    xhttp.send();
}
