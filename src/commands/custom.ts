import * as Discord from "discord.js";
import * as fs from "fs";
import * as Logger from "../utils/Logger";

// Mod command

/**
 * Deletes several messages at once.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
    if (args[0] == undefined && args[1] == undefined) {
        return message.reply("Sorry but the command needs the following args to work: `!custom [name of the command] [text of the command]`");
    }

    args[1] = message.content.split(" ").slice(2, message.content.length).join(" ").trim();

    let content = JSON.parse(fs.readFileSync('database/commands/commands.json', 'utf8'));

    if (content[message.guild.id] == undefined) {
        content[message.guild.id] = {};
    }

    content[message.guild.id][args[0]] = args[1];

    fs.writeFile("database/commands/commands.json", JSON.stringify(content), function (err) {
        if (err) {
            Logger.error(err);
        }

        message.reply(`Command \`${args[0]}\` successfully added to database. <a:check:690888185084903475>`);
    });
}
