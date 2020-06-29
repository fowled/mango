import * as Discord from "discord.js";
import * as Logger from "../utils/Logger";

// Mod command

/**
 * Locks a channel
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id != "352158391038377984") {
        return message.reply("You don't have the `ADMINISTRATOR` perm. <a:nocheck:691001377459142718>");
    }

    const role: Discord.Role = message.guild.roles.cache.find(r => r.name == args[0]);
    const messageChannel = args[1] == undefined ? message.channel as Discord.GuildChannel : message.guild.channels.cache.get(args[1].toString().split("<#")[1].split(">")[0]) as unknown as Discord.GuildChannel;

    if (!role) {
        return message.reply("I didn't find the role you specified. <a:nocheck:691001377459142718>");
    }

    messageChannel.overwritePermissions([{
        id: role.id,
        deny: ["SEND_MESSAGES"]
    }]).catch(err => {
        Logger.error(err)
        message.reply("An error occured. <a:nocheck:691001377459142718>");
    });
}
