import * as Discord from "discord.js";
import ms from "ms";

// Fun command

/**
 * A love meter between 2 members
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const member = message.mentions.members.first();
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    let messageContent = "\n";

    for (let index = 0; index < randomNumber; index++) {
        messageContent += ":revolving_hearts:";
    }

    for (let index = 0; index < 10 - randomNumber; index++) {
        messageContent += ":black_large_square:";
    }

    const lovemeter = new Discord.MessageEmbed()
        .setTitle("Lovemeter :heart:")
        .setAuthor(message.author.tag, message.author.avatar)
        .setColor("#08ABF9")
        .setDescription(`Current __lovemeter__ between you and *${member.user.tag}*: ${messageContent} \n→ **${randomNumber * 10}**% of love`)
        .setFooter(Client.user.username, Client.user.avatar)
        .setTimestamp()

    message.channel.send(lovemeter);
}