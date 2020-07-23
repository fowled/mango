import * as Discord from "discord.js";
import * as fs from "fs";
import * as Logger from "../../utils/Logger";
import * as hastebin from "../../utils/PostToHastebin";

// Fun command

/**
 * Shows your inventory w/ market
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */

export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    let inventory = JSON.parse(fs.readFileSync("database/inventory/items.json", "utf8"));
    let authorInventory = inventory[message.author.id];

    if (authorInventory == undefined) {
        return message.reply("Your inventory is empty! Start by doing `ma!market` and then buy something with the `ma!buy [ID of the item]` command.");
    }

    let itemsArray: string[] = [`# ${message.author.tag} inventory:`];
    let splittedItems: string[] = authorInventory.items.split("\n");
    
    for (var i = 0; i < splittedItems.length; i++) {
        itemsArray.push(splittedItems[i]);
    }

    hastebin.postText(itemsArray.join("\n")).then(res => {
        message.reply(`Click on the link to get your inventory: *${res}*`);
    }).catch(err => {
        Logger.error(err);
    });

}

const info = {
    name: "inventory",
    description: "Show your inventory",
    category: "fun",
    args: "none"
}

export { info };
