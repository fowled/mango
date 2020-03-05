const { post } = require("request");
import * as Discord from "discord.js";
import * as Hastebin from "../utils/PostToHastebin";
import * as Logger from "../utils/Logger";

// Pastebin command - TEST COMMAND

/**
 * Test command
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any): Promise<void> {
    Hastebin.postText(`Users: ${client.users.size} \nGuilds: ${client.guilds.size}`)
        .then(res => {
            message.reply("Here is the link! " + res);
        })
        .catch(err => {
            Logger.error(err);
        });
}