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
    let area;
    let country;
    let completedArea: any;
    let url: string;

    if (!args[0]) {
        return message.reply("You must specify a country to get its hour.");
    }

    try {
        if (!args[1]) {
            setTimeout(function () {
                country = args[0].toLowerCase();
                const xhttp: XMLHttpRequest = new XMLHttpRequest();

                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        let requestArray = xhttp.responseText.toLowerCase().split(args[0].toLowerCase())[0];
                        requestArray = requestArray.split("/");

                        completedArea = requestArray[Object.keys(requestArray).length - 2].split("\n")[1];

                        url = `http://worldtimeapi.org/api/timezone/${completedArea}/${args[0]}.json`
                    }
                };

                xhttp.open("GET", "http://worldtimeapi.org/api/timezone.txt", true);
                xhttp.send();
            }, 400);

        } else {
            area = args[0].toLowerCase();
            country = args[1].toLowerCase();
            url = `http://worldtimeapi.org/api/timezone/${area}/${country}.json`
        }

        setTimeout(function () {
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const parsedRequest = JSON.parse(xhttp.responseText);
                    let time = new Date(parsedRequest.datetime.split("+")[0]).toLocaleTimeString();
                    message.reply(`It is currently **${time}** in *${country}*.`);
                } else if (this.readyState == 4 && this.status == 404) {
                    return message.reply("It looks like the city you specified is invalid. Here is a list of valid areas: http://worldtimeapi.org/api/timezone.txt");
                }
            };

            xhttp.open("GET", url, true);
            xhttp.send();
        }, 1000);
    } catch (err) {
        message.reply("An unknown error happened. I'm sorry. Please retry the command <a:nocheck:691001377459142718>");
    }

}
