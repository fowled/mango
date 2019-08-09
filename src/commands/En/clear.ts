import * as Discord from "discord.js";

// Mod command

/**
 * Supprime plusieurs messages d'un coup
 * @param {Discord.Client} Client le client
 * @param {Discord.Message} Message le message contenant la commande
 * @param {string[]} args les arguments de la commande
 * @param {any} options les options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any) {
    if (args[0] && !parseInt(args[0]) && isNaN(parseInt(args[0]))) {
        message.reply("Please select a number of messages to delete.");
    } else if (parseInt(args[0]) <= 99) {
        var numberOfMessages: number = Number.parseInt(args[0]);
        message.channel.bulkDelete(numberOfMessages);
    } else {
        message.reply("Please only provide numbers from 1 to 100.");
    }
}