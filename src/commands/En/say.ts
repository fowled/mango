import * as Discord from "discord.js";

// Fun command

/**
 * Says something in dm to the selected user (with its ID)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	let messageToSay = message.content.split(" ");
	messageToSay = messageToSay.slice(1, messageToSay.length - 2);
	const taggedUser = message.mentions.users.first();
	const date = new Date();
	if (taggedUser) {
		message.channel.send("Message is sending :postbox:");
		Client.users.get(taggedUser.id).send(`*${message.author.username} sent you: \`${messageToSay.join(" ")}\` at ${date.toLocaleString()}*.`)
			.catch((err: Error) => {
				message.channel.send("User is blocking DMs :frowning:");
			});
	} else {
		message.reply("I don't know who to send this, please select a user!");
	}
}
