import * as Discord from "discord.js";
import * as Fs from "fs";
import * as hastebin from "../utils/PostToHastebin";

// Fun command

/**
 * answers with the guild's level leaderboard (levelboard)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string, options: any) {
    let levels: string[] = ["# Levelboard of the server"];

    let memberIDs: string[] = [];
    message.guild.members.forEach(member => memberIDs.push(member.id));

    let data = Fs.readFileSync("database/ranks/ranks.json", "utf8");
    data = JSON.parse(data);

    Object.keys(data).forEach((key) => {
        if (memberIDs.includes(key)) {
            levels.push(`- *${data[key]}* XP / Level **${Math.ceil(parseInt(data[key]) / 50)}** - [${Client.users.get(key).tag}]`);
        }
    });

    levels.forEach(() => {
        sortArray();
    });

    hastebin.postText(levels.join("\n")).then(res => {
        message.reply("The server **levelboard** is available here: " + res);
    }).catch(err => {
        console.error(err);
    });

    function sortArray() {
        levels.sort(function (a, b) {
            return <any>b.split("*")[1] - <any>a.split("*")[1];
        });
    }

}
