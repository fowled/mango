import * as Discord from "discord.js";
import * as fs from "fs";
import * as Logger from "../../utils/Logger";

// Fun command

/**
 * Shows your inventory w/ market
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */

export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {

}

const info = {
    name: "inventory",
    description: "Show your inventory",
    category: "fun",
    args: "none"
}

export { info };
