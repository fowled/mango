import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";

// Moderation command

/**
 * Mutes a user
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "unmute",
    description: "Unmutes a user",
    category: "moderation",
    options: [
        {
            name: "user",
            type: "USER",
            description: "The user I have to unmute",
            required: true
        }
    ],

    async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
        const memberUnmute: Discord.GuildMember = message.type === "APPLICATION_COMMAND" ? await message.guild.members.fetch(args[0]) : message.mentions.members.first();

        if (memberUnmute.permissions.has(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
            return message.reply("Sorry, but I can't unmute the user you specified, because he has one of the following perms: `ADMINISTATOR` or `MANAGE_MESSAGES`.");
        }

        let muteRole: Discord.Role = message.guild.roles.cache.find(role => role.name === "muted");

        if (!muteRole || !memberUnmute.roles.cache.has(muteRole.id)) {
            return message.reply(`It looks like that **${memberUnmute.user.tag}** isn't muted :eyes:`);
        } else if (!message.member.permissions.has(["ADMINISTRATOR"])) {
            return message.reply("You don't have the permission to unmute this person.");
        }

        try {
            memberUnmute.roles.remove(muteRole);
            message.reply(`**${memberUnmute.user.tag}** has been successfully unmuted. <:yes:835565213498736650>`);
            LogChecker.insertLog(Client, message.guild.id, message.member.user, `**${memberUnmute.user.tag}** has been __unmuted__ by ${message.member.user.tag}.`);
        } catch (error) {
            message.reply("Sorry, but I got an unexcepted error while unmuting this user. " + + `\`\`\`${error.message}\`\`\``);
        }
    }
}