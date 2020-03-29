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

    Fs.readdirSync("database/ranks/").forEach(file => {
        levels.push(file);
    });

    let memberIDs: string[] = [];
    message.guild.members.forEach(member => memberIDs.push(member.id));

    let IDsArray: any[] = [];

    Object.values(levels).forEach((file, index) => {
        if (Object.values(memberIDs).includes(file)) {
            IDsArray.push(file);
        }
    });

    let compareRanks: any[] = [];
    let users: string[] = [];

    IDsArray.forEach((file, index) => {
        let data = Fs.readFileSync(`database/ranks/${file}`);
        compareRanks.push(`- ${data} XP => Lvl. ${Math.ceil(parseInt(data as unknown as string) / 50)} - "${message.guild.members.get(file).user.tag}"`);
        users.push(message.guild.members.get(file).user.tag);
        sortArray();
    });

    message.channel.send(`\`\`\`js\n${compareRanks.join("\n")}\`\`\``);

    function sortArray() {
        compareRanks.sort(function (a, b) {
            return b.split("- ")[1].split(" XP")[0] - a.split("- ")[1].split(" XP")[0];
        });
    }

}
