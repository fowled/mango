import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest";

// Fun command

/**
 * Replies with a funny or cutie picture of a cat :3
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    // const APIKey = "fa96fd75-4c39-4f49-b89c-16f9a408bd62";
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const parsedRequest = JSON.parse(xhttp.responseText);
            const catPicture = parsedRequest[0].url;
            let breeds;
            
            try {
                breeds = parsedRequest[0].breeds[0].name;
            } catch (err) {
                breeds = "no breed found for this cat :frowning:";
            }

            message.reply(`Breed(s): **${breeds}**`, {file: catPicture});
        }
    };

    xhttp.open("GET", "https://api.thecatapi.com/v1/images/search", true);
    xhttp.send();
}
