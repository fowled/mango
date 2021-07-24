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
module.exports = {
    name: "tempmute",
    description: "Temporarily mutes a user",
    category: "moderation",
    options: [
        {
            name: "user",
            type: "USER",
            description: "The user I have to mute",
            required: true
        },

        {
            name: "duration",
            type: "STRING",
            description: "The mute duration",
            required: true
        },

        {
            name: "reason",
            type: "STRING",
            description: "The reason of the mute",
            required: false
        }
    ],

    async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
        const memberMute: Discord.GuildMember = message.type === "APPLICATION_COMMAND" ? await message.guild.members.fetch(args[0]) : message.mentions.members.first();

        if (!memberMute) {
            return message.reply("You specified an invalid user to mute. Please tag him in order to mute them.");
        } else if (memberMute.permissions.has(["ADMINISTRATOR"])) {
            return message.reply("Sorry, but I can't mute the user you specified, because he has the Administrator permission.");
        } else if (!message.member.permissions.has(["MANAGE_MESSAGES"])) {
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

                message.guild.channels.cache.forEach(async (channel: Discord.GuildChannel, id) => {
                    await channel.permissionOverwrites.edit(muteRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });

            } catch (error) {
                message.reply("Sorry, but I got an unexcepted error while creating the role. " + `\`\`\`${error.message}\`\`\``);
            }
        }

        let mutetime = args[1];

        if (!mutetime) {
            return message.reply("You didn't specify a time to mute the user! :confused:");
        } else if (!ms(mutetime)) {
            return message.reply("This isn't a correct duration time. Please retry with a valid one.");
        }

        let reason = args[2] == undefined ? "no reason specified." : (message.type === "APPLICATION_COMMAND" ? args[2] : args.slice(1, args.length).join(" "));

        await memberMute.roles.add(muteRole).catch(err => {
            return message.reply("Looks like I'm missing permissions. Check them in the server settings.");
        });

        message.reply(`**${memberMute.user.tag}** has been muted for *${ms(ms(mutetime))}*. <:yes:835565213498736650>`);

        LogChecker.insertLog(Client, message.guild.id, message.member.user, `**${memberMute.user.tag}** has been __tempmuted__ by ${message.member.user.tag} for: *${reason}* \nDuration of the punishment: ${ms(ms(mutetime))}`);

        setTimeout(async function () {
            memberMute.roles.remove(muteRole);
        }, ms(mutetime));

    }
}
