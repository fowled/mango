import * as Discord from "discord.js";

// Mod command

/**
 * Warns a user.
 * @param {Discord.Client} Client le client
 * @param {Discord.Message} Message le message contenant la commande
 * @param {string[]} args les arguments de la commande
 * @param {any} options les options
 */
export default async (Client: Discord.Client, message: Discord.Message, args: string[], ops: void) => {
	const taggedUser: Discord.User = message.mentions.users.first();
	const member: Discord.GuildMember = message.guild.member(taggedUser);

	if (member && member.kickable) {
		let commande: string = message.content.split(" ").slice(2).join(" ");

		if (commande === "") {
			commande = "Pas de raison spécifiée"; // on a les args pour ça, verrai après
		}

		const date = new Date();
		const warnGuildRichEmbed: Discord.RichEmbed = new Discord.RichEmbed()
			.setTitle(`Warn`)
			.setDescription(`**${taggedUser.tag}** has been warned by *${message.author.tag}* on __${date.toLocaleDateString()}__: *"${commande}"*.`)
			.setAuthor(message.author.username, message.author.avatarURL)
			.setFooter(Client.user.username, Client.user.avatarURL)
			.setColor("#4292f4")
			.setTimestamp();
		message.channel.send(warnGuildRichEmbed);

		const warnUserRichEmbed: Discord.RichEmbed = new Discord.RichEmbed()
			.setTitle(`Warn`)
			.setDescription(`You have been warned by **${message.author.username}**  __${date.toLocaleString()}__ avec la raison *"${commande}"*.`)
			.setAuthor(message.author.username, message.author.avatarURL)
			.setFooter(Client.user.username, Client.user.avatarURL)
			.setColor("#4292f4")
			.setTimestamp();
		Client.users.get(taggedUser.id).send(warnUserRichEmbed).catch((error: Error) => {
			message.channel.send(`Information : l'utilisateur **${taggedUser.tag}** n'accepte pas les dm venant de serveurs, et le message warn n'a pas pu être envoyé.`);
		});
	} else {
		message.reply("Vous n'avez pas les droits d'avertir cet utilisateur !");
	}

};
