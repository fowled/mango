import Discord from "discord.js";

export function logCommand(Client: Discord.Client, cmd: Discord.MessageEmbed) {
	Client.channels.fetch(process.env.CMD_CHANNEL).then((channel: Discord.TextChannel) => {
		channel.send({ embeds: [cmd] });
	});
}

export function logError(Client: Discord.Client, err: Discord.MessageEmbed) {
	Client.channels.fetch(process.env.ERR_CHANNEL).then((channel: Discord.TextChannel) => {
		channel.send({ embeds: [err] });
	});
}
