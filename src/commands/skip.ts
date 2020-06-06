import * as Discord from "discord.js";

// Music command

/**
 * Skips actual guild music.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const serverQueue = ops.queue.get(message.guild.id);
    
    if (!message.member.voice.channel) {
        return message.channel.send("You aren't in a voice channel!");
    } 

    if (!serverQueue) {
        return message.channel.send("Nothing is currently playing.");
    }

    serverQueue.connection.dispatcher.end();

    if (serverQueue.songs.length == 1) {
        return message.channel.send("Automatically left the channel, because there isn't any song left in this server queue. If you believe this is an error, please use the `ma!play` command again.");
    } else {
        return message.channel.send("Song has been skipped. Moving on to the next one...");
    }
}
