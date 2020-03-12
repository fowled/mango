import * as Discord from "discord.js";
import * as LogChecker from "../utils/LogChecker";
import ms from "ms";

// Moderation command

/**
 * Mutes a user
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[]) {
    const userMute: Discord.User = message.mentions.users.first();
    const memberMute: Discord.GuildMember = message.guild.member(userMute);

    if (!memberMute) {
        return message.reply("You specified an invalid user to mute. Please tag him in order to mute them.");
    }

    if (memberMute.hasPermission(["ADMINISTRATOR"])) {
       return  message.reply("Sorry, but I can't mute the user you specified, because he has the Administrator permission.");
    }

    let muteRole: Discord.Role = message.guild.roles.find(role => role.name === "muted");

    if (!muteRole) {
        try {
            muteRole = await message.guild.createRole({
                name: "muted",
                mentionable: false,
                permissions: [],
                color: "#524F4F"
            });

            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muteRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                })
            });

        } catch (error) {
            message.reply("Sorry, but I got an unexcepted error while creating the role. " + + `\`\`\`${error.message}\`\`\``);
        }
    }

    let mutetime = args[1].toString();

    if (!mutetime) {
        return message.reply("You didn't specify a time to mute the discordian! :confused:");
    }

    let reason = args[2] == undefined ? "no reason specified." : message.content.split(args[1])[1].trim();

    await memberMute.addRole(muteRole);
    message.reply(`**${memberMute.user.tag}** has been muted for *${ms(ms(mutetime))}*. :white_check_mark:`);
    LogChecker.insertLog(Client, message.author, userMute, message.guild.id, "temporarily muted", reason, ms(ms(mutetime)));

    setTimeout(function () {
        memberMute.removeRole(muteRole);
    }, ms(mutetime));

}

