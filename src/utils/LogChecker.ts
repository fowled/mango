import * as Discord from "discord.js";
import * as Sequelize from "sequelize";
import { sequelizeinit } from "../index";
import * as Logger from "./Logger";

export async function insertLog(Client: Discord.Client, guildID: string, author, msg: string) {
    const logchannelmodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = sequelizeinit.model("logChannels");
    const logchannel = await logchannelmodel.findOne({ where: { idOfGuild: guildID } });

    if (!logchannel) return;

    const logChannelID = logchannel.get("idOfChannel") as `${bigint}`;

    const logMessageEmbed = new Discord.MessageEmbed()
        .setAuthor(author.tag, author.avatarURL())
        .setColor("#2D2B2B")
        .setDescription(msg)
        .setFooter(Client.user.username, Client.user.avatarURL())
        .setTimestamp();

    try {
        (await Client.channels.fetch(logChannelID) as Discord.TextChannel).send({ embeds: [logMessageEmbed] });
    } catch (e) {
        Logger.error(e);
    }
}
