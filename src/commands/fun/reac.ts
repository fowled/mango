import * as Discord from "discord.js";

// Fun command

/**
 * Reacts to a certain message with a emoji (even animated!)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string, options: any) {
    const id: string = args[1];

    switch (args[0].charAt(0)) {
        case "<":
            emojiOfGuild();
            break;

        case ":":
            emojiWithoutNitro();
            break;

        default:
            reactToMsg(args[0]);
    }

    function emojiOfGuild() {
        const emoji: Object = args[0].split(":");
        let emojiID: any = Object.values(emoji)[Object.keys(emoji).length - 1];
        emojiID = emojiID.split(">")[0];
        const grabEmoji: Discord.Emoji = Client.emojis.cache.get(emojiID.toString());
        reactToMsg(grabEmoji);
    }

    function emojiWithoutNitro() {
        const emoji: Object = args[0].split(":");
        let emojiID: string[] = Object.values(emoji)[1];
        const grabEmoji: Discord.Emoji = Client.emojis.cache.find(emj => emj.name == emojiID.toString());
        reactToMsg(grabEmoji);
    }

    function reactToMsg(givenEmoji: any) {
        message.delete({ timeout: 500 }).catch(err => {
            message.reply("I don't have the perms to delete that message. Ask an admin!").then((msg: Discord.Message) => {
                msg.delete({ timeout: 3000 });
            });
        });

        if (id) {
            message.channel.messages.fetch(id).then((msg: Discord.Message) => {
                msg.react(givenEmoji).then(msg => {
                    setTimeout(function () {
                        msg.remove();
                    }, 15000);
                }).catch(err => {
                    message.reply("Sorry, an unknown error happened. Please retry the command.").then((msg: Discord.Message) => {
                        msg.delete({ timeout: 3000 });
                    });
                });
            });
        } else {
            message.channel.messages.fetch({ limit: 2 }).then(msg => {
                msg.last().react(givenEmoji).then(msg => {
                    setTimeout(function () {
                        msg.remove();
                    }, 15000);
                }).catch(err => {
                    message.reply("Sorry, an unknown error happened. Please retry the command.").then((msg: Discord.Message) => {
                        msg.delete({ timeout: 3000 });
                    });
                });
            });
        }

    }
}
