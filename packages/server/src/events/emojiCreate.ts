import Discord from "discord.js";

import { insertLog } from "../utils/logChecker";

module.exports = {
	name: "emojiCreate",
	execute(Client: Discord.Client, emoji: Discord.GuildEmoji) {
		insertLog(Client, emoji.guild.id, Client.user, `An emoji has been created: ${emoji}`);
	},
};
