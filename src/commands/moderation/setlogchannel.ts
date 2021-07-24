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
module.exports = {
    name: "setlogchannel",
    description: "Sets the guild's log channel for Mango",
    category: "moderation",
    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to set logs to",
            required: false
        }
    ],

    async execute(Client: Discord.Client, message: Discord.Message, args, ops) {
        if (!message.member.permissions.has(["ADMINISTRATOR"])) {
            return message.reply("I'm sorry, but you don't have the `ADMINISTRATOR` permission.");
        }

        let logChannelID = args[0] ? args[0].replace(/\D+/g, "") : message.channel.id;
        let fetchChannel = await Client.channels.fetch(logChannelID) as Discord.TextChannel;

        if (fetchChannel.type !== "GUILD_TEXT") {
            return message.reply(`The channel you specified isn't a text channel. Please retry the command.`);
        }

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

        return message.reply(`<:yes:835565213498736650> Successfully updated the log channel to \`#${fetchChannel.name}\`!`);
    }
}
