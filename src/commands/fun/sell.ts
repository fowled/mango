import * as Discord from "discord.js";
import * as fs from "fs";
import * as Logger from "../../utils/Logger";

// Fun command

/**
 * Sells something to the black market (lmfao)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const item: string = args.slice(1, args.length).join(" ");
    const price: string = args[0];
    
    if (item == "" || price == undefined) {
        return message.reply("You can't sell an empty item! `sell [price] [item]`");
    }
    
    let content = JSON.parse(fs.readFileSync('database/market/items.json', 'utf8'));

    const currentID = content["curID"] += 1;

    content[currentID] = {};
    content[currentID]["price"] = price;
    content[currentID]["name"] = item;
    content[currentID]["seller"] = message.author.tag;
    content[currentID]["sellerID"] = message.author.id;

    fs.writeFile(`database/market/items.json`, JSON.stringify(content), function (err) {
        if (err) {
            Logger.error(err);
            return message.reply("Sorry but an unexcepted error happened while saving data file. The error has been sent to the devloper, and we're trying to correct it. :ok_hand:");
        }

        message.reply(`The item \`${item}\` with price \`${price}\`$ was succesfully added to the market. ID of your item: **${content["curID"]}** <a:check:690888185084903475>`);
    });
}
