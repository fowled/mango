import * as Discord from "discord.js";

export let titleNotShown = true;

// Music command

/**
 * The bot leaves the vocal channel.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	if (!message.member.voice.channel) {
		return message.channel.send("Hey, please connect to a voice channel.");
	}

	if (!message.guild.me.voice.channel) {
		return message.channel.send("The bot isn't connected to this channel.");
	}

	if (message.guild.me.voice.channelID !== message.member.voice.channelID) {
		return message.channel.send("We are not connected to the same vocal channel!");
	}

	message.member.voice.channel.leave();

	return message.react("👍");
}

const info = {
    name: "leave",
    description: "Tell Mango to leave the vocal channel you're in",
    category: "music",
    args: "none"
}

export { info };
