import * as Discord from "discord.js";
import * as Logger from "./Logger";
import * as fs from "fs";

export function insertLog(Client: Discord.Client, guildID: string, author, msg: string) {
    let channelID: any;
    try {
        fs.readFile(`./database/log/channels.json`, "utf8", (err, data) => {
            data = JSON.parse(data);

            if (data[guildID] == undefined) {
                return;
            }

            channelID = data[guildID];

            const logMessageEmbed = new Discord.MessageEmbed()
                .setAuthor(author.tag, author.avatarURL())
                .setColor("#2D2B2B")
                .setDescription(msg)
                .setFooter(Client.user.username, Client.user.avatarURL())
                .setTimestamp();

            // @ts-ignore
            Client.channels.cache.get(channelID).fetch().then(chan => chan.send(logMessageEmbed));
        });
    } catch (error) {
        Logger.error(error);
    }
}