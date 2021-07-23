import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";

// Mod command

/**
 * Deletes several messages at once.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "clear",
    description: "Deletes several messages at once",
    category: "moderation",
    options: [
        {
            name: "number",
            type: "STRING",
            description: "The number of messages to delete",
            required: true
        }
    ],

    async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
        if (!message.member.permissions.has(["MANAGE_MESSAGES"])) {
            return message.reply("Sorry, but you don't have the `MANAGE_MESSAGES` permission.");
        }

        const channel = message.channel as unknown as Discord.TextChannel;

        if (args.length > 0) {
            if (!isNaN(parseInt(args[0], 10)) && parseInt(args[0], 10) >= 1 && parseInt(args[0], 10) <= 100) {
                channel.bulkDelete(parseInt(args[0], 10)).then(() => {
                    return (message.type === "APPLICATION_COMMAND") ? message.reply(`<:yes:835565213498736650> Successfully deleted ${args[0]} messages!`) : message.channel.send(`<:yes:835565213498736650> Successfully deleted ${args[0]} messages!`);
                }).catch((error: Error) => message.reply("I don't have the permission to delete messages."));
                LogChecker.insertLog(Client, message.guild.id, message.member.user, `**${args[0]}** messages got deleted in *${message.channel}* by ${message.member.user.tag}`);

            } else {
                message.reply("Invlid number provided. Only provided number between 1 and 100");
            }

        } else {
            message.reply("Please enter the number of messages to delete!");
        }
    }
}
