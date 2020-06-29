import * as Discord from "discord.js";
import * as fs from "fs";
import * as Logger from "../utils/Logger";

// Fun command

/**
 * Shows XP/Level of the user.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[]) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.reply("I'm sorry, but you don't have the `ADMINISTRATOR` permission.");
    }

    let welcomeChannelID = args[0].toString().split("<#")[1].split(">")[0];

    if (!welcomeChannelID) {
        return message.channel.send("Please send the name or the ID of the channel you want welcome messages in.");
    }

    try {
        let welcomeChannel = Client.channels.cache.get(welcomeChannelID);
        let content = JSON.parse(fs.readFileSync('database/welcome/channels.json', 'utf8'));

        content[message.guild.id] = welcomeChannelID;

        fs.writeFile(`database/welcome/channels.json`, JSON.stringify(content), function (err) {
            if (err) {
                Logger.error(err);
                return message.reply("Sorry but an unexcepted error happened while saving data file. The error has been sent to the devloper, and we're trying to correct it. :ok_hand:");
            }

            // @ts-ignore
            welcomeChannel.send("Success! This channel is now the default welcoming messages channel of this guild. <a:check:690888185084903475>");
        });
    } catch (err) {
        Logger.error(err);
        return message.reply("I couldn't find the channel you specified. Please check my permissions to view that channel, or verify the channel's spelling.");
    }
}
