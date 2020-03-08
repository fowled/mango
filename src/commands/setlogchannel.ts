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
    let logChannelID = args[0].toString().split("<#")[1].split(">")[0];

    if (!logChannelID) {
        return message.channel.send("Please send the name or the ID of the channel you want logs in.");
    }

    try {
        let logChannel = Client.channels.find("id", logChannelID);
        fs.writeFile(`database/log/${message.guild.id}`, logChannelID, function (err) {
            if (err) {
                Logger.error(err);
                return message.reply("Sorry but an unexcepted error happened while saving data file. The error has been sent to the devloper, and we're trying to correct it. :ok_hand:");
            }
            // @ts-ignore
            logChannel.send("Success! This channel is now the default logging channel of this guild. :white_check_mark:");
        });
    } catch (err) {
        Logger.error(err);
        return message.reply("I couldn't find the channel you specified. Please check my permissions to view that channel, or verify the channel's spelling.");
    }
}
