import * as Discord from "discord.js";
import * as LogChecker from "../utils/LogChecker";

module.exports = {
    name: "emojiCreate",
    execute(emoji: Discord.GuildEmoji, Client: Discord.Client) {
        LogChecker.insertLog(Client, emoji.guild.id, Client.user, `An emoji has been created: ${emoji}`);
    }
};
