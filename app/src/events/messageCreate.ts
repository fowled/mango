import Discord from "discord.js";

import { prisma } from "index";

import { checkXP } from "utils/xp";

module.exports = {
    name: "messageCreate",
    async execute(_Client: Discord.Client, message: Discord.Message) {
        if (!message.author.bot) return checkXP(message, prisma);
    },
};
