import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest";

// Fun command

/**
 * Replies with a funny or cutie picture of a dog :3
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "dog",
    description: "Replies with a picture of a dog",

    execute(Client: Discord.Client, message: Discord.Message & Discord.CommandInteraction, args, ops) {
        const xhttp = new XMLHttpRequest();
        let emojiList: string[] = [":confused:", ":confounded:", ":disappointed_relieved:", ":frowning:"];
        let checkMessageType: boolean = message.type === "APPLICATION_COMMAND";

        if (checkMessageType) message.defer();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const parsedRequest = JSON.parse(xhttp.responseText);
                const dogPicture = new Discord.MessageAttachment(parsedRequest[0].url);

                let embed = new Discord.MessageEmbed()
                    .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                    .setColor("#0FB1FB")
                    .setDescription("Here is some info about your doggo.")
                    .addField("Breed", getSafe(() => parsedRequest[0].breeds[0].name), true)
                    .addField("Life span", getSafe(() => parsedRequest[0].breeds[0].life_span), true)
                    .addField("Temperament", getSafe(() => parsedRequest[0].breeds[0].temperament))
                    .setTimestamp()
                    .setFooter(Client.user.username, Client.user.avatarURL());

                checkMessageType ? message.editReply({ embeds: [embed], files: [dogPicture] }) : message.reply({ embeds: [embed], files: [dogPicture] });
            }
        };

        xhttp.open("GET", "https://api.thedogapi.com/v1/images/search", true);
        xhttp.send();

        function getSafe(fn: any) {
            try {
                return fn();
            } catch (e) {
                return `unspecified ${emojiList[Math.floor(Math.random() * emojiList.length)]}`;
            }
        }
    }
}
