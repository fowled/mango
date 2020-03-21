import * as Discord from "discord.js";
import * as Logger from "./Logger";
import * as fs from "fs";

export function insertLog(Client: Discord.Client, author: Discord.User, guildID: any, commandName?: string, caughtUser?, reason?: any, duration?: string) {
    let channelID: any;
    try {
        fs.readFile(`./database/log/${guildID}`, (err, data) => {
            if (err) {
                return Logger.error("Didn't find the file containing the guild's log channel.");
            }

            channelID = data;
            let typeOfMessage = `**${caughtUser.tag}** has been __${commandName}__ by ${author.tag} for the reason: *${reason}*. \nDuration of the punishment: **${duration}**.`;

            const logRichEmbed = new Discord.RichEmbed()
                .setAuthor(author.tag, author.avatarURL)
                .setColor("#2D2B2B")
                .setDescription(typeOfMessage)
                .setFooter(Client.user.username, Client.user.avatarURL)
                .setTimestamp();

            // @ts-ignore
            Client.channels.get(channelID.toString()).send(logRichEmbed);
        });
    } catch (error) {
        Logger.error(error);
    }
}