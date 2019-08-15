export let titleNotShown = true;

export function run(client, message, args, ops) {

	if (!message.member.voiceChannel) {
		return message.channel.send("Hey, please connect to a voice channel.");
	}

	if (!message.guild.me.voiceChannel) {
		return message.channel.send("The bot isn't connected to this channel.");
	}

	if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) {
		return message.channel.send("We are not connected to the same vocal channel!");
	}

	message.member.voiceChannel.leave();

	return message.react("👍");
}
