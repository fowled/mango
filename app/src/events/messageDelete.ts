import Discord from "discord.js";

import { insertLog } from "utils/logChecker";

module.exports = {
    name: "messageDelete",
    async execute(Client: Discord.Client, message: Discord.Message) {
        await insertLog(Client, message.guild.id, Client.user, `A message has been deleted - Content: \`\`\`${message.content}\`\`\``);
    },
};
