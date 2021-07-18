import * as Discord from "discord.js";
import * as LogChecker from "../utils/LogChecker";

module.exports = {
    name: "channelCreate",
    execute(channel: Discord.GuildChannel, Client: Discord.Client) {
        LogChecker.insertLog(Client, channel.guild.id, Client.user, `A ${channel.type} channel has been created: ${channel}`);
    }
};
