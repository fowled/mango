import * as Discord from "discord.js";
import * as LogChecker from "../utils/LogChecker";

module.exports = {
    name: "messageDelete",
    execute(message: Discord.Message, Client: Discord.Client) {
        LogChecker.insertLog(Client, message.guild.id, Client.user, `A message has been deleted - Content: \`\`\`${message.content}\`\`\``);
    }
};
