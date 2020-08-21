import * as Discord from "discord.js";
import * as Fs from "fs";
import * as hastebin from "../../utils/PostToHastebin";

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
    message.guild.members.cache.forEach(member => memberIDs.push(member.id));

    let data = Fs.readFileSync("database/ranks/ranks.json", "utf8");
    data = JSON.parse(data);
    let dataKeys = Object.keys(data);

    for (let i = 0; i < 10; i++) {
        if (memberIDs.includes(dataKeys[i])) {
            levels.push(`${i}. *${data[dataKeys[i]]}* XP | Level **${Math.ceil(parseInt(data[dataKeys[i]]) / 50)}** - [${Client.users.cache.get(dataKeys[i]).tag}]`);
        }
    }

    levels.forEach(() => {
        sortArray();
    });

    const levelEmbed = new Discord.MessageEmbed()
        .setTitle("🎖 Levelboard!")
        .setDescription(levels.join("\n"))
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(Client.user.username, Client.user.displayAvatarURL())

    message.channel.send(levelEmbed);

    function sortArray() {
        levels.sort(function (a, b) {
            return <any>b.split("*")[1] - <any>a.split("*")[1];
        });
    }

}

const info = {
    name: "levelboard",
    description: "Replies with a hastebin link of the server's XP leaderboard",
    category: "fun",
    args: "none"
}

export { info };

