import * as Discord from "discord.js";

// Member command

/**
 * Shows some user information.
 * @param {Discord.Client} Client le client
 * @param {Discord.Message} Message le message contenant la commande
 * @param {string[]} args les arguments de la commande
 * @param {any} options les options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], options: any): Promise<void> {
	const selectedUser: Discord.GuildMember = message.mentions.users.size > 0 ? (message.guild.members.fetch(message.mentions.members.first()) ? message.mentions.members.first() : null) : message.member;

	let badges: {} = {
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
		"EARLY_VERIFIED_DEVELOPER": "<:developer:835496891101478933>"
	}

	let badgesArray: string[] = [];

	selectedUser.user.flags.toArray().forEach(badge => {
		badgesArray.push(badges[badge]);
	});

	if (badgesArray.length == 0) {
		badgesArray[0] = ":negative_squared_cross_mark:";
	}

	selectedUser.user.displayAvatarURL({ dynamic: true }).endsWith('.gif') ? badgesArray.push("<:nitro:835496891520778250>") : "Not nitro";
	selectedUser.premiumSince ? badgesArray.push("<:boosting_1:835503285833826354>") : "Not boosting";

	if (selectedUser) { // In the same server
		const userinfoMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setAuthor(selectedUser.user.username, selectedUser.user.avatarURL())
			.setThumbnail(selectedUser.user.avatarURL())
			.setTimestamp()
			.addField("Name", selectedUser.user.username, true)
			.addField("Tag", selectedUser.user.discriminator, true)
			.addField("Bot?", selectedUser.user.bot ? "yes" : "no", true)
			.addField("Badges", badgesArray.join(" "), true)
			.addField("Game", selectedUser.presence.activities.length > 0 ? selectedUser.presence.activities.toString() : "none", true)
			.addField("Joined on", (await message.guild.members.fetch(selectedUser)).joinedAt.toLocaleDateString(), true)
			.addField("Created on", selectedUser.user.createdAt.toLocaleDateString(), true)
			.addField("Permissions", selectedUser.permissions.toArray().length === 0 ? "No permission" : `${selectedUser.permissions.toArray().length} permissions`, true)
			.addField("Boosting", selectedUser.premiumSince ? selectedUser.premiumSince.toLocaleString() : "No", true)
			.addField("Roles", selectedUser.roles.cache.size === 1 ? "No role" : selectedUser.roles.cache.filter(role => role.name !== "@everyone").array().join(", "), false)
			.setColor("RANDOM")
			.setFooter(Client.user.username, Client.user.avatarURL());

		message.reply({ embeds: [userinfoMessageEmbed] });
	} else {
		message.reply("Tagged user is not in the server :frowning:");
	}
}

const info = {
	name: "userinfo",
	description: "Get useful information on a user",
	category: "info",
	args: "none"
}

export { info };

