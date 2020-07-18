import * as Discord from "discord.js";
import * as Hastebin from "../../utils/PostToHastebin";

// Fun command

/**
 * Creates a custom haste
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
    const whatToPost = args.join(" ");

    Hastebin.postText(whatToPost)
    .then(res => {
        message.reply("Here is your hastebin: " + res);
    }).catch(err => {
        message.reply("An error happened. Please retry the command.");
    })
}

const info = {
    name: "hastebin",
    description: "Write something on a beautiful picture",
    category: "fun",
    args: "[your text]"
}

export { info };

