import * as Discord from "discord.js";
import * as Logger from "./Logger";
import * as fs from "fs";

export function insertLog(Client: Discord.Client, guildID: string, author, msg: string) {
    let channelID: any;
    try {
        fs.readFile(`./database/log/${guildID}`, (err, data) => {
            if (err) {
                return Logger.log("Didn't find the file containing the guild's log channel.");
            }

            channelID = data;

            const logRichEmbed = new Discord.RichEmbed()
                .setAuthor(author.tag, author.avatarURL)
                .setColor("#2D2B2B")
                .setDescription(msg)
                .setFooter(Client.user.username, Client.user.avatarURL)
                .setTimestamp();

            // @ts-ignore
            Client.channels.get(channelID.toString()).send(logRichEmbed);
        });
    } catch (error) {
        Logger.error(error);
    }
}