import Discord from "discord.js";
import { insertLog } from "../../utils/logChecker";

// Moderation command

/**
 * Mutes a user
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "unmute",
	description: "Unmutes a user",
	category: "moderation",
	botPermissions: ["MANAGE_ROLES"],
	memberPermissions: ["MANAGE_ROLES", "MANAGE_MESSAGES"],
	options: [
		{
			name: "user",
			type: "USER",
			description: "The user I have to unmute",
			required: true,
		},
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction, args: string[]) {
		const memberUnmute = await interaction.guild.members.fetch(args[0]);

		const muteRole = interaction.guild.roles.cache.find((role) => role.name === "muted");

		if (!muteRole || !memberUnmute.roles.cache.has(muteRole.id)) {
			return interaction.editReply(`It looks like that **${memberUnmute.user.tag}** isn't muted :eyes:`);
		}

		try {
			memberUnmute.roles.remove(muteRole);

			interaction.editReply(`**${memberUnmute.user.tag}** has been successfully unmuted. <:yes:835565213498736650>`);

			insertLog(Client, interaction.guild.id, interaction.user, `**${memberUnmute.user.tag}** has been __unmuted__ by ${interaction.user.tag}.`);
		} catch (error) {
			interaction.editReply("Sorry, but I got an unexcepted error while unmuting this user. " + +`\`\`\`${error.message}\`\`\``);
		}
	},
};
