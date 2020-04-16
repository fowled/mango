import * as Discord from "discord.js";
import * as fs from "fs";
import * as Logger from "../utils/Logger";

// Fun command

/**
 * Sells something to the black market (lmfao)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const ID = args[0];
    
    if (!ID) {
        return message.reply("In order to buy something, you must provide the item's ID.");
    }
    
    let content = JSON.parse(fs.readFileSync('database/market/items.json', 'utf8'));
    let money = JSON.parse(fs.readFileSync('database/money/data.json', 'utf8'));
    money = money[message.author.id] == undefined ? "0" : money[message.author.id];

    console.log(money);

    if (money < content[ID]["price"]) {
        return message.reply(`You must have \`${content[ID]["price"] - money}\` more dollars to get this item. :frowning:`);
    } else {
        delete(content[ID]);
    }

    fs.writeFile(`database/market/items.json`, JSON.stringify(content), function (err) {
        if (err) {
            Logger.error(err);
            return message.reply("Sorry but an unexcepted error happened while saving data file. The error has been sent to the devloper, and we're trying to correct it. :ok_hand:");
        }
    });
}
