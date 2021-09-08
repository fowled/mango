import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest";

// Fun command

/**
 * Replies with a funny or cutie picture of a dog :3
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "dog",
    description: "Replies with a picture of a dog",
    category: "fun",
    botPermissions: ["ATTACH_FILES"],

    execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message) {
        const xhttp = new XMLHttpRequest();
        const emojiList: string[] = [":confused:", ":confounded:", ":disappointed_relieved:", ":frowning:"];

        interaction.deferReply();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const parsedRequest = JSON.parse(xhttp.responseText);
                const dogPicture = new Discord.MessageAttachment(parsedRequest[0].url);

                const embed = new Discord.MessageEmbed()
                    .setAuthor(interaction.member.user.tag, interaction.member.user.avatarURL())
                    .setColor("#0FB1FB")
                    .setDescription("Here is some info about your doggo.")
                    .addField("Breed", getSafe(() => parsedRequest[0].breeds[0].name), true)
                    .addField("Life span", getSafe(() => parsedRequest[0].breeds[0].life_span), true)
                    .addField("Temperament", getSafe(() => parsedRequest[0].breeds[0].temperament))
                    .setTimestamp()
                    .setFooter(Client.user.username, Client.user.avatarURL());

                interaction.editReply({ embeds: [embed], files: [dogPicture] });
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
