import * as Discord from "discord.js";
import * as FS from "fs";

// Fun command

exports.run = async (client, message, args, ops) => {

    message.channel.startTyping();

    setTimeout(function () {
        FS.readFile(`ranks/${message.author.id}.txt`, (err, data) => {

            let level: number = Math.floor(parseInt(data.toString()) / 50);

            getExactLvl(level);

            function getExactLvl(lvl) {
                let finalLvl = lvl.split(".")[0];

                const levelEmbedMessage = new Discord.RichEmbed()
                    .setTitle(`${message.author.tag} level`)
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setDescription(`Your level - :gem: XP: **${data}** | :large_orange_diamond: Level: **${finalLvl}** `)
                    .setColor('#019FE9')
                    .setFooter(client.user.username, client.user.avatarURL)
                    .setTimestamp()
                message.channel.send(levelEmbedMessage);

            }

        });
    }, 2000)

    message.channel.stopTyping();

}