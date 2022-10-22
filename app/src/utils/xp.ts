import Discord from "discord.js";

import type { PrismaClient } from "@prisma/client";

export async function checkXP(message: Discord.Message, prisma: PrismaClient) {
    const Xp = prisma.ranks;

    const level = await Xp.findFirst({
        where: { idOfUser: message.member.user.id, idOfGuild: message.guild.id },
    });

    if (level) {
        await Xp.updateMany({
            where: { idOfUser: message.member.user.id, idOfGuild: message.guild.id },
            data: { xp: level.xp + 1 },
        });
    } else {
        await Xp.create({
            data: {
                idOfUser: message.member.user.id,
                xp: 0,
                idOfGuild: message.guild.id,
            },
        });
    }
}
