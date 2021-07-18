import * as Discord from "discord.js";

// Mod command

/**
 * Warns a user.
 * @param {Discord.Client} Client le client
 * @param {Discord.Message} Message le message contenant la commande
 * @param {string[]} args les arguments de la commande
 * @param {any} options les options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: void) {
	const taggedUser: Discord.User = message.mentions.users.first();
	const reason = args.slice(1).join(" ");

	if (!message.member.permissions.has("KICK_MEMBERS")) {
		return message.reply("Sorry, but you need the `KICK_MEMBERS` permission to warn a user.");
	} else if (!taggedUser) {
		return message.reply("You must tag a user. `ma!warn @user reason`");
	} else if (!args[2]) {
		return message.reply("You must specify a reason before warning a user `ma!warn @user reason`");
	}

	const date = new Date();
	const warnGuildMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
		.setTitle(`Warn`)
		.setDescription(`**${taggedUser.tag}** has been warned by *${message.member.user.tag}* on __${date.toLocaleDateString()}__: *"${reason}"*.`)
		.setAuthor(message.member.user.username, message.member.user.avatarURL())
		.setFooter(Client.user.username, Client.user.avatarURL())
		.setColor("#4292f4")
		.setTimestamp();
	message.reply({ embeds: [warnGuildMessageEmbed] });

	const warnUserMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
		.setTitle(`Warn`)
		.setDescription(`You have been warned by **${message.member.user.username}**  __${date.toLocaleString()}__. Reason: *"${reason}"*.`)
		.setAuthor(message.member.user.username, message.member.user.avatarURL())
		.setFooter(Client.user.username, Client.user.avatarURL())
		.setColor("#4292f4")
		.setTimestamp();
	Client.users.cache.get(taggedUser.id).send({ embeds: [warnUserMessageEmbed] }).catch((error: Error) => {
		message.reply(`**${taggedUser.tag}** doesn't accept DMs from servers.`);
	});

}

const info = {
	name: "warn",
	description: "Warn a member",
	category: "moderation",
	args: "[@user] [reason]"
}

export { info };
