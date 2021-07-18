import * as Discord from "discord.js";

module.exports = {
	name: "guildCreate",
	async execute(guild: Discord.Guild, Client: Discord.Client) {
		const channel: Discord.TextChannel = guild.channels.cache.find(chan => chan.name === "welcome" && chan.type === "text") as unknown as Discord.TextChannel;
		const guildOwner: Discord.GuildMember = (await guild.fetchOwner());

		if (!channel) { return; }

		const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setTitle(`Hi, I'm ${Client.user.username} and I'm new in ${guild.name}!`)
			.setDescription(`Help message has been sent to ${guildOwner.user.tag}, but they are also available typing *ma!help*.`)
			.setThumbnail(guild.iconURL())
			.setColor("RANDOM")

		channel.send({ embeds: [embed] });

		const ownerEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
			.setTitle(`Thank you for adding me in ${guild.name}!`)
			.setDescription(`Help message: *ma!help*`)
			.setThumbnail(guild.iconURL())
			.setColor("RANDOM")

		guildOwner.send({ embeds: [ownerEmbed] });
	}
};
