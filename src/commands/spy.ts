import * as Discord from "discord.js";

// Spy command - owner only

/**
 * Replies with the different guild's names where the bot is in
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
    if (message.author.id !== "352158391038377984") {
        return message.reply("You don't have access to that command.");
    }

    let i: number = 1;
    let x: number = 1;

    const guilds: any[] = [];

    Client.guilds.forEach(function (guild) {
        guilds.push(`#${i} ~ ${guild.name} - <@${guild.id}>`);
        i++;
    });

    const users: any[] = [];

    Client.users.forEach(function (user) {
        let userIsBot;

        if (user.bot === true) {
            userIsBot = "is a bot";
        } else {
            userIsBot = "isn't a bot";
        }

        users.push(`#${x} ~ ${user.tag} - <@${user.id}> - ${userIsBot}`);
        x++
    });

    const firstMessage: any[] = users.slice(0, Math.ceil(users.length / 2));
    const secondMessage: any[] = users.slice(Math.ceil(users.length / 2), users.length);

    message.channel.send("```md\n- " + guilds.join("\n- ") + "```");
    message.channel.send("```md\n- " + firstMessage.join("\n- ") + "```");
    message.channel.send("```md\n- " + secondMessage.join("\n- ") + "```");
}
