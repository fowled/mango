import Discord from "discord.js";

import { insertLog } from "../utils/logChecker";

module.exports = {
	name: "channelDelete",
	execute(Client: Discord.Client, channel: Discord.GuildChannel, ) {
		insertLog(Client, channel.guild.id, Client.user, `A ${channel.type} channel has been deleted: **${channel.name}**`);
	},
};
