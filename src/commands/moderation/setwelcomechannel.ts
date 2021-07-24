import * as Discord from "discord.js";
import * as Sequelize from "sequelize";
import * as fs from "fs";
import * as Logger from "../../utils/Logger";

// Fun command

/**
 * Saves the ID of the channel you want welcome messages in.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "setwelcomechannel",
    description: "Sets guild's welcome channel for Mango",
    category: "moderation",
    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to set welcome channels to",
            required: false
        }
    ],

    async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return message.reply("I'm sorry, but you don't have the `ADMINISTRATOR` permission.");
        }

        let welcomeChannelID = args[0] ? args[0].replace(/\D+/g, "") : message.channel.id;
        let fetchChannel = await Client.channels.fetch(welcomeChannelID) as Discord.TextChannel;

        if (fetchChannel.type !== "GUILD_TEXT") {
            return message.reply(`The channel you specified isn't a text channel. Please retry the command.`);
        }

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

        return message.reply(`<:yes:835565213498736650> Successfully updated the welcome channel to \`#${fetchChannel.name}\`!`);
    }
}
