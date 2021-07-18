import * as Discord from "discord.js";
import * as LogChecker from "../utils/LogChecker";

module.exports = {
    name: "channelDelete",
    execute(channel: Discord.GuildChannel, Client: Discord.Client) {
        LogChecker.insertLog(Client, channel.guild.id, Client.user, `A ${channel.type} channel has been deleted: **${channel.name}**`);
    }
};
