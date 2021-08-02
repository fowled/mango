import * as Discord from "discord.js";

// Ping command

/**
 * Tests the bot ping.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "ping",
	description: "Get info on Mango's latency",
	category: "info",

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
		await interaction.reply("Ping?");
		const ping: Discord.Message = interaction.fetchReply() as unknown as Discord.Message;

		const pong: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setTitle(`Latency information for ${interaction.member.user.tag}`)
			.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
			.setColor("RANDOM")
			.setDescription("Latency information")
			.addField("Host latency", `**${Math.floor(ping.createdTimestamp - interaction.createdTimestamp)}** ms.`)
			.addField("API latency", `**${Math.round(Client.ws.ping)}** ms.`, true)
			.setFooter(Client.user.username, Client.user.avatarURL())
			.setTimestamp();

		interaction.editReply({ embeds: [pong] });
	}
}
