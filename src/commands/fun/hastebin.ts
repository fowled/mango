import * as Discord from "discord.js";
import * as Hastebin from "../../utils/PostToHastebin";

// Fun command

/**
 * Creates a custom haste
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
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
    
    execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
        const whatToPost = args.join(" ");
    
        Hastebin.postText(whatToPost)
        .then(res => {
            interaction.reply("Here is your hastebin: " + res);
        }).catch(() => {
            interaction.reply("An error happened. Please retry the command.");
        });
    }
}
