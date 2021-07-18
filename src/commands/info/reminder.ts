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
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const time = args[0];
    const content = args.slice(1, args.length).join(" ");
    const date = new Date();

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

        message.member.user.send({ embeds: [reminderAuthor] });
    }, ms(time));
}

const info = {
    name: "reminder",
    description: "Set a reminder with Mango",
    category: "info",
    args: "[duration]"
}

export { info };
