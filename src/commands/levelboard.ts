import * as Discord from "discord.js";
import * as Fs from "fs";

// Fun command

/**
 * answers with the guild's level leaderboard (levelboard)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string, options: any) {
    let levels: string[] = [];

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

    message.channel.send(`\`\`\`markdown\n# Levelboard of the server \n${levels.join("\n")}\`\`\``);

    function sortArray() {
        levels.sort(function (a, b) {
            return <any>b.split("*")[1] - <any>a.split("*")[1];
        });
    }

}
