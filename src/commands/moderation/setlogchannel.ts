import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

// Fun command

/**
 * Saves the ID of the channel you want logs in.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "setlogchannel",
    description: "Sets the guild's log channel for Mango",
    category: "moderation",

    memberPermissions: ["MANAGE_CHANNELS"],
    options: [
        {
            name: "channel",
            type: "CHANNEL",
            description: "The channel you want to set logs to",
            required: false
        }
    ],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
        if (!interaction.member.permissions.has(["ADMINISTRATOR"])) {
            return interaction.reply("I'm sorry, but you don't have the `ADMINISTRATOR` permission.");
        }

        let logChannelID = args[0] ? args[0].replace(/\D+/g, "") : interaction.channel.id;
        let fetchChannel = await Client.channels.fetch(logChannelID) as Discord.TextChannel;

        if (fetchChannel.type !== "GUILD_TEXT") {
            return interaction.reply(`The channel you specified isn't a text channel. Please retry the command.`);
        }

        const logchannelmodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("logChannels");
        const logchannel = await logchannelmodel.findOne({ where: { idOfGuild: interaction.guild.id } });

        if (logchannel) {
            logchannelmodel.update({ idOfChannel: logChannelID }, { where: { idOfGuild: interaction.guild.id } });
        } else {
            logchannelmodel.create({
                idOfGuild: interaction.guild.id,
                idOfChannel: interaction.channel.id
            });
        }

        return interaction.reply(`<:yes:835565213498736650> Successfully updated the log channel to \`#${fetchChannel.name}\`!`);
    }
}
