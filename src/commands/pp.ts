import * as Discord from "discord.js";

// User command

/**
 * Answers to the user with his profile pic link
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any): Promise<void> {
    const profilePic = message.author.avatarURL;
    message.reply(`Here is the link to your profile picture: **${profilePic}**`);
}