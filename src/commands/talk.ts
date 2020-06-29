import * as Discord from "discord.js";
import * as Logger from "../utils/Logger";

// Fun command

/**
 * Says something in the server
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    let messageToSay: any = message.content.split(" ");
    messageToSay = messageToSay.slice(1, messageToSay.length);
    detectEmojis(messageToSay);
    let attachment;

    if (message.attachments.size > 0) {
        attachment = message.attachments.first().url;
    }

    if (messageToSay == "") {
        messageToSay = ["No ", "message"];
    }

    const richMessage: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setTitle(`Message by ${message.author.tag}`)
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`> ${messageToSay.join(" ")}`)
        .addField("Sent on server...", message.guild.name)
        .setImage(attachment)
        .setTimestamp()
        .setFooter(Client.user.username, Client.user.avatarURL());

    //@ts-ignore
    const interchatChannel: Discord.Channel = Client.channels.findAll("name", "mango-interchat").map((chan: { send: (arg0: Discord.MessageEmbed) => any; }) => chan.send(richMessage));
    setTimeout(function () {
        message.delete().catch(err => Logger.error(err));
    }, 500);

    function detectEmojis(msg: string | any[]) {
        for (let index: number = 0; index < msg.length; index++) {
            if (msg[index].startsWith(":") && msg[index].endsWith(":")) {
                const emoji = Client.emojis.cache.find(emj => emj.name == msg[index].split(":")[1]);
                messageToSay.splice(index, 1, emoji);
            }
        }
    }
}
