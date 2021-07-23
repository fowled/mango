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
    name: "mute",
    description: "Mutes a user",
    category: "moderation",
    options: [
        {
            name: "user",
            type: "USER",
            description: "The user I have to mute",
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

        if (memberMute.permissions.has(["ADMINISTRATOR"])) {
            return message.reply("Sorry, but I can't mute the user you specified, because he has one of the following perms: `ADMINISTRATOR`");
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

            } catch (error) {
                message.reply("Sorry, but I got an unexcepted error while creating the role. " + + `\`\`\`${error.message}\`\`\``);
            }
        }

        message.guild.channels.cache.forEach(async (channel: Discord.GuildChannel, id) => {
            await channel.permissionOverwrites.edit(muteRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            });
        });

        await memberMute.roles.add(muteRole);

        let reason = args[1] == undefined ? "no reason specified." : (message.type === "APPLICATION_COMMAND" ? args[1] : args.slice(1, args.length).join(" "));

        message.reply(`**${memberMute.user.tag}** has been muted for: *${reason}*. <:yes:835565213498736650>`);

        LogChecker.insertLog(Client, message.guild.id, message.member.user, `**${memberMute.user.tag}** has been __muted__ by ${message.member.user.tag} for: *${reason}* \nDuration of the punishment: infinite`);
    }
}
