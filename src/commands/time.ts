import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest";

// Fun command

/**
 * Replies with the hour of the specified country
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const xhttp: XMLHttpRequest = new XMLHttpRequest();
    let area = args[0].toLowerCase();
    let country = args[1];
    let completedArea: any;
    let url: string;

    if (!args[0]) {
        return message.reply("You must specify a country to get its hour.");
    }

    if (!args[1]) {
        country = args[0];
        const xhttp: XMLHttpRequest = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let requestArray = xhttp.responseText.split(args[0])[0];
                requestArray = requestArray.split("/");

                completedArea = requestArray[Object.keys(requestArray)[Object.keys(requestArray).length - 2]].split("\n")[1];

                url = `http://worldtimeapi.org/api/timezone/${completedArea}/${args[0]}.json`
            }
        };

        xhttp.open("GET", "http://worldtimeapi.org/api/timezone.txt", true);
        xhttp.send();

    } else {
        url = `http://worldtimeapi.org/api/timezone/${area}/${country}.json`
    }

    setTimeout(function () {
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const parsedRequest = JSON.parse(xhttp.responseText);
                let time = new Date(parsedRequest.datetime.split("+")[0]).toLocaleTimeString();
                message.reply(`It is currently **${time}** in *${country}*.`);
            } else if (this.readyState == 4 && this.status == 404) {
                return message.reply("It looks like the country you specified is invalid. Here is a list of valid areas: http://worldtimeapi.org/api/timezone.txt");
            }
        };

        xhttp.open("GET", url, true);
        xhttp.send();
    }, 400);

}