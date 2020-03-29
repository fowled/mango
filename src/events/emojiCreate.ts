import * as Discord from "discord.js";
import * as LogChecker from "../utils/LogChecker";

export default async(Client: Discord.Client, emoji: Discord.Emoji) => {
    LogChecker.insertLog(Client, emoji.guild.id, Client.user, `An emoji has been created: ${emoji}`);
};
