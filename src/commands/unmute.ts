import * as Discord from "discord.js";
import * as LogChecker from "../utils/LogChecker";

// Moderation command

/**
 * Mutes a user
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[]) {
    const userUnmute: Discord.User = message.mentions.users.first();
    const memberUnmute: Discord.GuildMember = message.guild.member(userUnmute);

    if (memberUnmute.hasPermission(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
        return message.reply("Sorry, but I can't unmute the user you specified, because he has one of the following perms: `ADMINISTATOR` or `MANAGE_MESSAGES`.");
    }

    let muteRole: Discord.Role = message.guild.roles.find(role => role.name === "muted");

    if (!muteRole && !memberUnmute.roles.has("muteRole")) {
        return message.reply(`It looks like that **${memberUnmute.user.tag}** isn't muted :eyes:`);
    }

    if (!message.member.hasPermission(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
        return message.reply("You don't have the permission to unmute this person.");
    }

    try {
        memberUnmute.removeRole(muteRole);
        message.reply(`**${memberUnmute.user.tag}** has been successfully unmuted. <a:check:690888185084903475>`);
        LogChecker.insertLog(Client, message.guild.id, message.author, `**${memberUnmute.user.tag}** has been __unmuted__ by ${message.author.tag}.`);
    } catch (error) {
        message.reply("Sorry, but I got an unexcepted error while unmuting this user. " + + `\`\`\`${error.message}\`\`\``);
    }
}
