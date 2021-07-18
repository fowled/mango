import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

// Fun command

/**
 * answers with the guild's level leaderboard (levelboard)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "levelboard",
    description: "Replies with the server XP level leaderboard",
    
    async execute(Client: Discord.Client, message: Discord.Message & Discord.CommandInteraction, args, ops) {
        const Xp: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("ranks");
        const ranks = await Xp.findAll({ order: [["xp", "DESC"]] });

        let levels: string[] = [];
        let index = 1;

        ranks.forEach((item) => {
            let user = { id: item.getDataValue("idOfUser"), xp: item.getDataValue("xp") };
            let medal = (index) == 1 ? ":medal:" : (index) == 2 ? ":second_place:" : (index) == 3 ? ":third_place:" : "";
            let getUser = Client.users.cache.get(user.id);

            if (getUser) {
                levels.push(`${medal} ${index}. **${getUser.tag}** / *${user.xp}* xp → level \`${Math.floor(user.xp / 50)}\``);
                index++;
            }
        });

        let page: number = 1;
        let trimLimit: number = (levels.length > 10) ? page * 10 : levels.length + 1;
        let firstPageContent: string = levels.join("\n").split((trimLimit).toString() + ".")[0];

        const levelEmbed = new Discord.MessageEmbed()
            .setTitle("🎖 Levelboard")
            .setDescription(firstPageContent)
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter(Client.user.username, Client.user.displayAvatarURL());

        let msg = await message.reply({ embeds: [levelEmbed] });
        message.channel.messages.fetch(msg.id).then(async m => {
            await m.react("◀️");
            await m.react("▶️");
            createReactionCollector(m);
        });

        const filter = (reaction: any, user: { id: string; }) => {
            return user.id == message.member.user.id;
        };

        function createReactionCollector(m: Discord.Message) {
            m.awaitReactions({ filter, max: 1 })
                .then(collected => {
                    if (collected.first().emoji.name == "▶️") {
                        page++;
                        sendMessage(page);
                    } else {
                        page--;
                        sendMessage(page);
                    }

                    createReactionCollector(m);
                });
        }

        function sendMessage(page: number) {
            let whatToSend: string;

            try {
                whatToSend = page != 1 ? `${(page - 1) * 10}. ${levels.join("\n").split(`${((page - 1) * 10).toString()}.`)[1].split(`${(page * 10).toString()}.`)[0]}` : firstPageContent;
            } catch (e) {
                return;
            }

            const inventoryEmbed = new Discord.MessageEmbed()
                .setDescription(whatToSend)
                .setColor("#33beff")
                .setTitle(`🎖 Levelboard`)
                .setTimestamp()
                .setFooter(Client.user.username, Client.user.displayAvatarURL())

            message.reply({ embeds: [inventoryEmbed] }).then(async m => {
                await m.react("◀️");
                await m.react("▶️");

                createReactionCollector(m);
            });
        }
    }
}
