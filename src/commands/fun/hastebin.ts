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
module.exports = {
    name: "hastebin",
    description: "Write something to post on hastebin",
    category: "fun",
    options: [
        {
            name: "text",
            type: "STRING", 
            description: "The text you want to post on hastebin",
            required: true
        }
    ],
    
    execute(Client: Discord.Client, message: Discord.Message, args, ops) {
        const whatToPost = args.join(" ");
    
        Hastebin.postText(whatToPost)
        .then(res => {
            message.reply("Here is your hastebin: " + res);
        }).catch(err => {
            message.reply("An error happened. Please retry the command.");
        });
    }
}
