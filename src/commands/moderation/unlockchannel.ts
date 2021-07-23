import * as Discord from "discord.js";
import * as Logger from "../../utils/Logger";
import * as LogChecker from "../../utils/LogChecker";

// Mod command

/**
 * Locks a channel
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "unlockchannel",
    description: "Unlocks a channel",
    category: "moderation",
    options: [
        {
            name: "role",
            type: "MENTIONABLE",
            description: "The role you want to unlock the channel to",
            required: true
        },

        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel that will be unlocked",
            required: false
        }
    ],

    async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
        if (!message.member.permissions.has(["ADMINISTRATOR"])) {
            return message.reply("<:no:835565213322575963> You don't have the `ADMINISTRATOR` permission.");
        }

        const role: Discord.Role = message.type === "APPLICATION_COMMAND" ? await message.guild.roles.fetch(args[0]) : message.mentions.roles.first();
        const messageChannel = !args[1] ? message.channel as Discord.GuildChannel : (message.type === "APPLICATION_COMMAND" ? await message.guild.channels.fetch(args[1]) : args[1] as unknown as Discord.GuildChannel);

        if (!role) {
            return message.reply("I didn't find the role you specified. <:no:835565213322575963>");
        }

        messageChannel.permissionOverwrites.create(role, {
            "SEND_MESSAGES": true,
        }).then(() => {
            message.reply(`<:yes:835565213498736650> ${messageChannel} has been unlocked for ${role}.`)
        }).catch(err => {
            Logger.error(err);
            message.reply("An error occured. <:no:835565213322575963> ```\n" + err + "```");
        });

        // @ts-ignore
        LogChecker.insertLog(Client, message.guild.id, message.member.user, `**${message.channel}** (\`${message.channel.name}\`) has been unlocked by *${message.member.user.tag}*`);
    }
}
