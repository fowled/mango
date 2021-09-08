import * as Discord from "discord.js";

// Member command

/**
 * Shows some user information.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "userinfo",
	description: "Get useful information from a user",
	category: "info",
	options: [
		{
			name: "user",
			type: "USER",
			description: "The user you'd like to get information from",
			required: false
		},
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
		const selectedUser = args[0] ? await interaction.guild.members.fetch(args[0]) : interaction.member;

		const badges: {} = {
			"DISCORD_EMPLOYEE": "<:staff:835496891453669387>",
			"PARTNERED_SERVER_OWNER": "<:partner:835496891571634189>",
			"HYPESQUAD_EVENTS": "<:hypesquad_events:835496891101478934>",
			"BUGHUNTER_LEVEL_2": "<:bughunter_2:835496891113668629>",
			"BUGHUNTER_LEVEL_1": "<:bughunter_1:835496891432042496>",
			"HOUSE_BRAVERY": "<:bravery:835496891399143444>",
			"HOUSE_BRILLIANCE": "<:brilliance:835496891420377138>",
			"HOUSE_BALANCE": "<:balance:835496891453669386>",
			"EARLY_SUPPORTER": "<:early_supporter:835496891399536651>",
			"VERIFIED_BOT": "<:verified:835501423843999744>",
			"EARLY_VERIFIED_BOT_DEVELOPER": "<:developer:835496891101478933>"
		}

		const badgesArray: string[] = [];

		selectedUser.user.flags.toArray().forEach(badge => {
			badgesArray.push(badges[badge]);
		});

		if (badgesArray.length == 0) {
			badgesArray[0] = ":negative_squared_cross_mark:";
		}

		selectedUser.user.displayAvatarURL({ dynamic: true }).endsWith('.gif') ? badgesArray.push("<:nitro:835496891520778250>") : "Not nitro";
		selectedUser.premiumSince ? badgesArray.push("<:boosting_1:835503285833826354>") : "Not boosting";

		if (selectedUser) {
			const userinfoMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
				.setAuthor(selectedUser.user.username, selectedUser.user.avatarURL())
				.setThumbnail(selectedUser.user.avatarURL())
				.setTimestamp()
				.addField("Name", selectedUser.user.username, true)
				.addField("Tag", selectedUser.user.discriminator, true)
				.addField("Bot?", selectedUser.user.bot ? "yes" : "no", true)
				.addField("Badges", badgesArray.join(" "), true)
				.addField("Game", selectedUser.presence ? selectedUser.presence.activities.toString() : "none", true)
				.addField("Joined on", selectedUser.joinedAt.toLocaleDateString(), true)
				.addField("Created on", selectedUser.user.createdAt.toLocaleDateString(), true)
				.addField("Permissions", selectedUser.permissions.toArray().length === 0 ? "No permission" : `${selectedUser.permissions.toArray().length} permissions`, true)
				.addField("Boosting", selectedUser.premiumSince ? selectedUser.premiumSince.toLocaleString() : "No", true)
				.addField("Roles", selectedUser.roles.cache.size === 1 ? "No role" : selectedUser.roles.cache.filter(role => role.name !== "@everyone").map(el => el.name).join(", "), false)
				.setColor("RANDOM")
				.setFooter(Client.user.username, Client.user.avatarURL());

			interaction.reply({ embeds: [userinfoMessageEmbed] });
		} else {
			interaction.reply("Tagged user is not in the server :frowning:");
		}
	}
}
