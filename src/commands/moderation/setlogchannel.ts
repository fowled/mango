import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

// Fun command

/**
 * Saves the ID of the channel you want logs in.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.reply("I'm sorry, but you don't have the `ADMINISTRATOR` permission.");
    }

    let logChannelID = args[0] ? args[0].toString().split("<#")[1].split(">")[0] : message.channel.id;

    // @ts-ignore
    let logChannelName: string | Discord.GuildChannel = args[0] ? args[0].toString().split("<#")[1].split(">")[0] : message.channel.name;

    const logchannelmodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("logChannels");
    const logchannel = await logchannelmodel.findOne({ where: { idOfGuild: message.guild.id } });
    
    if (logchannel) {
        logchannelmodel.update({ idOfChannel: logChannelID }, { where: { idOfGuild: message.guild.id } });
    } else {
        logchannelmodel.create({
            idOfGuild: message.guild.id,
            idOfChannel: message.channel.id
        });
    }

    return message.channel.send(`<:yes:835565213498736650> Successfully updated the log channel to \`#${logChannelName}\`!`);
}

const info = {
    name: "setlogchannel",
    description: "Set guild's log channel for Mango",
    category: "moderation",
    args: "[#channel]"
}

export { info };
