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
	const member: Discord.GuildMember = message.guild.member(taggedUser);

	if (member && member.kickable) {
		let commande: string = message.content.split(" ").slice(2).join(" ");

		if (commande === "") {
			commande = "No reason";
		}

		const date = new Date();
		const warnGuildMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setTitle(`Warn`)
			.setDescription(`**${taggedUser.tag}** has been warned by *${message.author.tag}* on __${date.toLocaleDateString()}__: *"${commande}"*.`)
			.setAuthor(message.author.username, message.author.avatarURL())
			.setFooter(Client.user.username, Client.user.avatarURL())
			.setColor("#4292f4")
			.setTimestamp();
		message.channel.send(warnGuildMessageEmbed);

		const warnUserMessageEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setTitle(`Warn`)
			.setDescription(`You have been warned by **${message.author.username}**  __${date.toLocaleString()}__. Reason: *"${commande}"*.`)
			.setAuthor(message.author.username, message.author.avatarURL())
			.setFooter(Client.user.username, Client.user.avatarURL())
			.setColor("#4292f4")
			.setTimestamp();
		Client.users.cache.get(taggedUser.id).send(warnUserMessageEmbed).catch((error: Error) => {
			message.channel.send(`**${taggedUser.tag}** doesen't accept DMs from servers.`);
		});
	} else {
		message.reply("You can't warn this user.");
	}

}

const info = {
    name: "warn",
    description: "Warn a member",
    category: "moderation",
    args: "[@user] (reason)"
}

export { info };
