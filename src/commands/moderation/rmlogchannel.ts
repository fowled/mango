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

    const logchannelmodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("logChannels");
    const logchannel = await logchannelmodel.findOne({ where: { idOfGuild: message.guild.id } });

    if (logchannel) {
        logchannel.destroy();
    } else {
        return message.channel.send("I'm sorry, but you don't have any log channel for the moment. Get started by doing `ma!setlogchannel [channel]`!");
    }

    return message.channel.send(`<a:check:745904327872217088> Successfully removed the log channel! You won't receive log notifications anymore. Was that a mistake? Don't worry, do \`ma!setlogchannel (#channel)\` to add it again.`);
}

const info = {
    name: "rmlogchannel",
    description: "Remove the guild's log channel for Mango",
    category: "moderation",
    args: "none"
}

export { info };
