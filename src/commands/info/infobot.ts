import * as Discord from "discord.js";
import * as si from "systeminformation";
import moment from "moment";

// Infobot command

/**
 * Replies with some info about the bot host
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */

export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    var cpuInfo, ramInfo, os, msgID;
    const discordVersion = require("discord.js/package.json").version;

    message.channel.send("Please wait up to 5 seconds, gathering information... Results will appear all at once.").then(msg => msgID = msg.id);

    await si.cpu().then(data => cpuInfo = data);
    await si.mem().then(data => ramInfo = data);
    await si.osInfo().then(data => os = data);

    const info = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription("About **Mango's infrastructure**")
        .addField("Node version", process.version)
        .addField("Discord.js version", discordVersion)
        .addField("OS", os.distro)
        .addField("CPU", cpuInfo.brand)
        .addField("Memory", `${(ramInfo.total / 104853.2055).toFixed()} mb`)
        .addField("Uptime", moment.duration(Client.uptime).humanize())
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(Client.user.username, Client.user.displayAvatarURL())

    message.channel.messages.fetch(msgID).then(msg => msg.edit(info));
}

const info = {
    name: "infobot",
    description: "Get info about Mango's infrastructure",
    category: "info",
    args: "none"
}

export { info };