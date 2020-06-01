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
    const xhttp = new XMLHttpRequest();
    let emojiList: string[] = [":confused:", ":confounded:", ":disappointed_relieved:", ":frowning:"];

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const parsedRequest = JSON.parse(xhttp.responseText);
            const catPicture = parsedRequest[0].url;
            let breeds;

            breeds = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatar)
                .attachFiles(catPicture)
                .setColor("0FB1FB")
                .setDescription("Here is some info about your cat.")
                .addField("Breed", getSafe(() => parsedRequest[0].breeds[0].name), true)
                .addField("Life span", getSafe(() => parsedRequest[0].breeds[0].life_span), true)
                .addField("Temperament", getSafe(() => parsedRequest[0].breeds[0].temperament))
                .setTimestamp()
                .setFooter(Client.user.username, Client.user.avatar);

            message.channel.send(breeds);
        }
    };

    xhttp.open("GET", "https://api.thecatapi.com/v1/images/search", true);
    xhttp.send();

    function getSafe(fn: any) {
        try {
            return fn();
        } catch (e) {
            return `unspecified ${emojiList[Math.floor(Math.random() * emojiList.length)]}`;
        }
    }
}
