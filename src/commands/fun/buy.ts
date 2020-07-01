import * as Discord from "discord.js";
import * as fs from "fs";
import * as Logger from "../../utils/Logger";

// Fun command

/**
 * Buys something on the black market (lmfao)
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

    if (money[message.author.id] == undefined) {
        money[message.author.id] = 500;
        fs.writeFileSync("database/money/data.json", JSON.stringify(money));
    }

    let refreshedMoney = JSON.parse(fs.readFileSync('database/money/data.json', 'utf8'));
    let seller = content[ID]["sellerID"];

    if (refreshedMoney[message.author.id] < content[ID]["price"]) {
        return message.reply(`You must have \`${content[ID]["price"] - refreshedMoney[message.author.id]}\` more dollars to get this item. :frowning:`);
    } else if (message.author.id == seller) {
        return message.reply("You can't buy your own item...");
    } else {
        refreshedMoney[message.author.id] -= content[ID]["price"];
        refreshedMoney[seller] += content[ID]["price"];
        message.reply(`Item **${content[ID]["name"]}** successfully bought for *${content[ID]["price"]}$*.`);
        delete (content[ID]);
    }

    fs.writeFileSync("database/money/data.json", JSON.stringify(refreshedMoney));

    fs.writeFile(`database/market/items.json`, JSON.stringify(content), function (err) {
        if (err) {
            Logger.error(err);
            return message.reply("Sorry but an unexcepted error happened while saving data file. The error has been sent to the devloper, and we're trying to correct it. :ok_hand:");
        }
    });
}
