import * as Discord from "discord.js";
import * as LogChecker from "../utils/LogChecker";

export default async(Client: Discord.Client, message: Discord.Message) => {
    LogChecker.insertLog(Client, message.guild.id, Client.user, `A message has been deleted - Content: \`${message.content}\``);
};
