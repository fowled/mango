import * as Discord from "discord.js";
import ms from "ms";

// Fun command

/**
 * Sets reminders, for you.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "reminder",
    description: "Set a reminder with Mango",
    category: "info",
    options: [
        {
            name: "duration",
            type: "STRING",
            description: "The time to wait before sending you the reminder",
            required: true
        },

        {
            name: "content",
            type: "STRING",
            description: "The reminder's content",
            required: true
        }
    ],

    async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
        const time = args[0];
        const content = args.slice(1, args.length).join(" ");
        const date = new Date();

        if (args.length < 2) {
            return message.reply("<:no:835565213322575963> It looks like you're missing arguments. Command usage: `ma!reminder <duration> <content>`");
        } else if (!ms(time)) {
            return message.reply("<:no:835565213322575963> The duration must follow this format - `50s`, `10m` or `10h`.");
        }

        const reminderEmbed = new Discord.MessageEmbed()
            .setTitle("Reminder")
            .setAuthor(message.member.user.tag, message.member.user.avatarURL())
            .setDescription(`Reminder **${content}** successfully saved - we'll send you a dm in ${ms(ms(time))} <:yes:835565213498736650>`)
            .setColor("#08ABF9")
            .setFooter(Client.user.username, Client.user.avatarURL())
            .setTimestamp()

        message.reply({ embeds: [reminderEmbed] });

        setTimeout(function () {
            const reminderAuthor = new Discord.MessageEmbed()
                .setTitle("Ding dong...")
                .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setDescription(`It's time to **${content}** - *reminder saved at ${date.toLocaleString()}.*`)
                .setColor("#08ABF9")
                .setFooter(Client.user.username, Client.user.avatarURL())
                .setTimestamp()

            message.member.user.send({ embeds: [reminderAuthor] }).catch(err => {
                message.channel.send(`<:no:835565213322575963> ${message.member.user} I couldn't send you the message as your private messages are turned off.`);
            });
        }, ms(time));
    }
}
