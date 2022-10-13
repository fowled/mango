import Discord from "discord.js";

import {insertLog} from "utils/logChecker";

module.exports = {
    name: "emojiCreate",
    async execute(Client: Discord.Client, emoji: Discord.GuildEmoji) {
        await insertLog(Client, emoji.guild.id, Client.user, `An emoji has been created: ${emoji}`);
    },
};
