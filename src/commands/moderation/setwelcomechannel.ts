import Discord from "discord.js";
import Sequelize from "sequelize";

// Fun command

/**
 * Saves the ID of the channel you want welcome messages in.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "setwelcomechannel",
	description: "Sets guild's welcome channel for Mango",
	category: "moderation",
	memberPermissions: ["MANAGE_CHANNELS"],
	options: [
		{
			name: "channel",
			type: "CHANNEL",
			description: "The channel you want to set welcome channels to",
			required: false,
		},
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], db: Sequelize.Sequelize) {
		const welcomeChannelID = args[0] ? args[0].replace(/\D+/g, "") : interaction.channel.id;
		const fetchChannel = (await Client.channels.fetch(welcomeChannelID)) as Discord.TextChannel;

		if (fetchChannel.type !== "GUILD_TEXT") {
			return interaction.editReply("The channel you specified isn't a text channel. Please retry the command.");
		}

		const welcomechannelmodel = db.model("welChannels");
		const welcomechannel = await welcomechannelmodel.findOne({ where: { idOfGuild: interaction.guild.id } });

		if (welcomechannel) {
			welcomechannelmodel.update({ idOfChannel: welcomeChannelID }, { where: { idOfGuild: interaction.guild.id } });
		} else {
			welcomechannelmodel.create({
				idOfGuild: welcomeChannelID,
				idOfChannel: interaction.channel.id,
			});
		}

		return interaction.editReply(`<:yes:835565213498736650> Successfully updated the welcome channel to \`#${fetchChannel.name}\`!`);
	},
};
