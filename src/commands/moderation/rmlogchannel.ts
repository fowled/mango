import Discord from "discord.js";
import Sequelize from "sequelize";

// Fun command

/**
 * Saves the ID of the channel you want logs in.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "rmlogchannel",
	description: "Removes the guild's log channel for Mango",
	category: "moderation",
	memberPermissions: ["MANAGE_CHANNELS"],

	async execute(_Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, _args: string[], db: Sequelize.Sequelize) {
		const logchannelmodel = db.model("logChannels");
		const logchannel = await logchannelmodel.findOne({ where: { idOfGuild: interaction.guild.id } });

		if (logchannel) {
			logchannel.destroy();
		} else {
			return interaction.editReply("I'm sorry, but you don't have any log channel for the moment. Get started by doing `/setlogchannel [channel]`!");
		}

		return interaction.editReply("<:yes:835565213498736650> Successfully removed the log channel! You won't receive log notifications anymore. Was that a mistake? Don't worry, do `/setlogchannel (#channel)` to add it again.");
	},
};
