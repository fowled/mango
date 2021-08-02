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
    name: "rmwelcomechannel",
    description: "Removes the guild's welcome channel for Mango",
    category: "moderation",

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
        if (!interaction.member.permissions.has(["ADMINISTRATOR"])) {
            return interaction.reply("I'm sorry, but you don't have the `ADMINISTRATOR` permission.");
        }

        const welcomechannelmodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("welChannels");
        const welcomechannel = await welcomechannelmodel.findOne({ where: { idOfGuild: interaction.guild.id } });

        if (welcomechannel) {
            welcomechannel.destroy();
        } else {
            return interaction.reply("I'm sorry, but you don't have any log channel for the moment. Get started by doing `/setwelcomechannel [channel]`!");
        }

        return interaction.reply(`<:yes:835565213498736650> Successfully removed the welcome channel! You won't receive welcome notifications anymore. Was that a mistake? Don't worry, do \`/setwelcomechannel (#channel)\` to add it again.`);
    }
}
