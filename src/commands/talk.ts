import * as Discord from "discord.js";

// Fun command

/**
 * Says something in the server
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    if (message.author.id != "352158391038377984") {
        return;
    }

	let messageToSay: string[] = message.content.split(" ");
    messageToSay = messageToSay.slice(1, messageToSay.length);

    let emojiarray = [];
    let guild = Client.guilds.get("510564701919510549");
    
    let everyemojis = guild.emojis.forEach(emj => emojiarray.push(emj));
    
    const messageToSend = emojiarray.join("");

    message.delete();
    message.channel.send(messageToSend);
}
