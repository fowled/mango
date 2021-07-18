import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";
import ms from "ms";

// Moderation command

/**
 * Mutes a user
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const userMute: Discord.User = message.mentions.users.first();
    const memberMute: Promise<Discord.GuildMember> = message.guild.members.fetch(userMute);

    if (!memberMute) {
        return message.reply("You specified an invalid user to mute. Please tag him in order to mute them.");
    }

    if ((await memberMute).permissions.has(["ADMINISTRATOR"])) {
        return message.reply("Sorry, but I can't mute the user you specified, because he has the Administrator permission.");
    }

    if (!message.member.permissions.has(["MANAGE_MESSAGES"])) {
        return message.reply("Sorry, but you don't have the permission to mute this user.");
    }

    let muteRole: Discord.Role = message.guild.roles.cache.find(role => role.name === "muted");

    if (!muteRole) {
        try {
            muteRole = await message.guild.roles.create({
                name: "muted",
                mentionable: false,
                permissions: [],
                color: "#524F4F"
            });

            message.guild.channels.cache.forEach(async (channel, id) => {
                await channel.updateOverwrite(muteRole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });

        } catch (error) {
            message.reply("Sorry, but I got an unexcepted error while creating the role. " + `\`\`\`${error.message}\`\`\``);
        }
    }

    let mutetime = args[1].toString();

    if (!mutetime) {
        return message.reply("You didn't specify a time to mute the discordian! :confused:");
    } else if (!ms(mutetime)) {
        return message.reply("This isn't a correct duration time. Please retry with a valid one.");
    }

    let reason = args[2] == undefined ? "no reason specified." : message.content.split(args[1])[1].trim();

    await (await memberMute).roles.add(muteRole);
    message.reply(`**${(await memberMute).user.tag}** has been muted for *${ms(ms(mutetime))}*. <:yes:835565213498736650>`);
    LogChecker.insertLog(Client, message.guild.id, message.member.user, `**${(await memberMute).user.tag}** has been __tempmuted__ by ${message.member.user.tag} for: *${reason}* \nDuration of the punishment: ${ms(ms(mutetime))}`);

    setTimeout(async function () {
        (await memberMute).roles.remove(muteRole);
    }, ms(mutetime));

}

const info = {
    name: "tempmute",
    description: "Tempmute a member",
    category: "moderation",
    args: "[@user] [duration] (reason)"
}

export { info };
