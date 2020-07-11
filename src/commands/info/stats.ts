import * as Discord from "discord.js";

export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const usersNumber = Client.users.cache.size;
    const guildsNumber = Client.guilds.cache.size;

    message.channel.send(`**Mango's** stats: \n- **${guildsNumber}** servers \n- **${usersNumber}** users.`);
}

const info = {
    name: "invit",
    description: "Get info on Mango's current stats",
    category: "info",
    args: "none"
}

export { info };