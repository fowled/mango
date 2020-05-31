import * as Discord from "discord.js";

export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const usersNumber = Client.users.size;
    const guildsNumber = Client.guilds.size;

    message.channel.send(`**Mango's** stats: \n- **${guildsNumber}** servers \n- **${usersNumber}** users.`);
}
