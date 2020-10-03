import * as Discord from "discord.js";
import * as LogChecker from "../utils/LogChecker";

export default async(Client: Discord.Client, channel: Discord.GuildChannel, ops: any) => {
    LogChecker.insertLog(Client, channel.guild.id, Client.user, `A ${channel.type} channel has been deleted: **${channel.name}**`);
};
