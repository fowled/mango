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
    const discordVersion = require("discord.js").version;
    let ramInfo: si.Systeminformation.MemData, os: si.Systeminformation.OsData;

    await si.mem().then(data => ramInfo = data);
    await si.osInfo().then(data => os = data);

    const info = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription("About **Mango's infrastructure**")
        .addField("Node version", process.version)
        .addField("Discord.js version", discordVersion)
        .addField("OS", os.distro)
        .addField("Memory", `${(ramInfo.total / 104853.2055).toFixed()} mb`)
        .addField("Uptime", moment.duration(Client.uptime).humanize())
        .addField("Stats", `» \`${Client.users.cache.size}\` users \n» \`${Client.guilds.cache.size}\` guilds`)
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(Client.user.username, Client.user.displayAvatarURL())

    message.channel.send(info);
}

const info = {
    name: "infobot",
    description: "Get info about Mango's infrastructure",
    category: "info",
    args: "none"
}

export { info };