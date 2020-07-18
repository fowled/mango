import * as Discord from "discord.js";
import * as fs from "fs";

// Fun command

/**
 * Replies with your money
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    let money = JSON.parse(fs.readFileSync('database/money/data.json', 'utf8'));

    if (money[message.author.id] == undefined) {
        return message.reply("You have no money. :money_with_wings:");
    }

    message.reply(`Your account currently has **${money[message.author.id]}**$.`);
}

const info = {
    name: "money",
    description: "Replies with your account's money",
    category: "fun",
    args: "none"
}

export { info };

