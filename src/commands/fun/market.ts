import * as Discord from "discord.js";
import * as fs from "fs";
import * as Logger from "../../utils/Logger";
import * as hastebin from "../../utils/PostToHastebin";

// Fun command

/**
 * Shows the black market (lmfao)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    let items = JSON.parse(fs.readFileSync("database/market/items.json", "utf-8"));
    let itemsArray: string[] = ["# Current Mango's market"];

    for (var i = 0; i < items["curID"] + 1; i++) {
        if (items[i] != undefined) {
            itemsArray.push(`- Item: "${items[i]["name"]}" / price: ${items[i]["price"]}$ \ seller: "${items[i]["seller"]}" ---- ID is: ${i}`);
        }
    }

    hastebin.postText(itemsArray.join("\n")).then(res => {
        message.reply(`The current Mango's **market** is available here: *${res}*`);
    }).catch(err => {
        Logger.error(err);
    });
}
