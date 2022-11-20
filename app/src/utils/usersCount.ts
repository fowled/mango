import { Client } from "discord.js";

export async function getUsersCount(client: Client) {
    let count = 0;

    await Promise.all(client.guilds.cache.map(g => {
        if (g.available) {
            count += g.memberCount
        }
    }));

    return count;
}

