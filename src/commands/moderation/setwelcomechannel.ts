import * as Discord from "discord.js";
import * as Sequelize from "sequelize";
import * as fs from "fs";
import * as Logger from "../../utils/Logger";

// Fun command

/**
 * Shows XP/Level of the user.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
        return message.reply("I'm sorry, but you don't have the `ADMINISTRATOR` permission.");
    }

    let welcomeChannelID = args[0] ? args[0].toString().split("<#")[1].split(">")[0] : message.channel.id;

    // @ts-ignore
    let welcomeChannelName: string | Discord.GuildChannel = args[0] ? args[0].toString().split("<#")[1].split(">")[0] : message.channel.name;

    const welcomechannelmodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("welChannels");
    const welcomechannel = await welcomechannelmodel.findOne({ where: { idOfGuild: message.guild.id } });

    if (welcomechannel) {
        welcomechannelmodel.update({ idOfChannel: welcomeChannelID }, { where: { idOfGuild: message.guild.id } });
    } else {
        welcomechannelmodel.create({
            idOfGuild: message.guild.id,
            idOfChannel: message.channel.id
        });
    }

    return message.channel.send(`<:yes:835565213498736650> Successfully updated the welcome channel to \`#${welcomeChannelName}\`!`);
}

const info = {
    name: "setwelcomechannel",
    description: "Set guild's welcome channel for Mango",
    category: "moderation",
    args: "[#channel]"
}

export { info };
