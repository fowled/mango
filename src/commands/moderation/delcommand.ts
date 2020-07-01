import * as Discord from "discord.js";
import * as fs from "fs";
import * as Logger from "../../utils/Logger";

// Fun command

/**
 * Deletes a custom command
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
    let content = JSON.parse(fs.readFileSync('database/commands/commands.json', 'utf8'));

    if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id != "352158391038377984") {
        return message.reply("You don't have permission to do that. <a:nocheck:691001377459142718>");
    }

    if (content[message.guild.id][args[0]] == undefined) {
        return message.reply(`I didn't find the \`${args[0]}\` command. <a:nocheck:691001377459142718>`);
    }

    delete content[message.guild.id][args[0]];
    fs.writeFile("database/commands/commands.json", JSON.stringify(content), function (err) {
        if (err) {
            Logger.error(err);
            return message.reply("Sorry, but an unknown error occured while saving the database file. Error has been logged and will be fixed asap. <a:nocheck:691001377459142718>");
        }
        return message.reply(`Successfully deleted \`${args[0]}\` command. <a:check:690888185084903475>`);
    });
}
