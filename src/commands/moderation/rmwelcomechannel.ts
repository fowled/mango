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
    if (!message.member.permissions.has("ADMINISTRATOR")) {
        return message.reply("I'm sorry, but you don't have the `ADMINISTRATOR` permission.");
    }

    const welcomechannelmodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("welChannels");
    const welcomechannel = await welcomechannelmodel.findOne({ where: { idOfGuild: message.guild.id } });

    if (welcomechannel) {
        welcomechannel.destroy();
    } else {
        return message.reply("I'm sorry, but you don't have any log channel for the moment. Get started by doing `ma!setwelcomechannel [channel]`!");
    }

    return message.reply(`<:yes:835565213498736650> Successfully removed the welcome channel! You won't receive welcome notifications anymore. Was that a mistake? Don't worry, do \`ma!setwelcomechannel (#channel)\` to add it again.`);
}

const info = {
    name: "rmwelcomechannel",
    description: "Remove the guild's welcome channel for Mango",
    category: "moderation",
    args: "none"
}

export { info };
