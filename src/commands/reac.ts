import * as Discord from "discord.js";

// Fun command

/**
 * Reacts to a certain message with a emoji (even animated!)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: any, options: any) {
    if (args[0].startsWith("<")) {
        const emoji: Object = args[0].split(":");
        let emojiID: any = Object.values(emoji)[Object.keys(emoji).length - 1];
        emojiID = emojiID.split(">")[0];
        const grabEmoji: Discord.Emoji = message.guild.emojis.get(emojiID.toString());
        reactToMsg(grabEmoji);
    } else if (args[0].startsWith(":")) {
        const emoji: Object = args[0].split(":");
        let emojiID: string[] = Object.values(emoji)[1];
        const grabEmoji: Discord.Emoji = message.guild.emojis.find(emj => emj.name == emojiID.toString());
        reactToMsg(grabEmoji);
    } else {
        reactToMsg(args[0]);
    }

    function reactToMsg(givenEmoji) {
        message.delete().catch(err => {
            message.reply("I don't have the perms to delete that message. Ask an admin!").then((msg: Discord.Message) => {
                msg.delete(3000);
            });
        });
        message.channel.fetchMessages({ limit: 2 }).then(msg => {
            const lastMessage = msg.last().react(givenEmoji).catch(err => {
                message.reply("Sorry, I was unable to fetch the lastest message of this channel.").then((msg: Discord.Message) => {
                    msg.delete(3000);
                });
            });
        });
    }
}
