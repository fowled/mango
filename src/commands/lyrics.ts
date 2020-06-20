import * as Discord from "discord.js";
import { getLyrics } from "genius-lyrics-api";
import getArtistTitle from 'get-artist-title';
import * as dotenv from "dotenv";
dotenv.config();

// Music command

/**
 * Skips actual guild music.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const accessToken = process.env.ACCESS_TOKEN;
    const queue: any = await ops.queue.get(message.guild.id);
    let songID;
    let songArtist, songTitle;

    async function retrieveArtistTitle() {
        [songArtist, songTitle] = await getArtistTitle(queue.songs[0].title, {
            defaultArtist: queue.songs[0].author.name
        });
    }

    await retrieveArtistTitle();

    const options = {
        apiKey: accessToken,
        title: songTitle,
        artist: songArtist,
        optimizeQuery: true
    };

    await gatherLyrics();

    async function gatherLyrics() {
        await getLyrics(options).then((lyrics) => {
            if (lyrics == null) {
                return message.channel.send(`No lyrics found for **${queue.songs[0].title}**.`);
            } else {
                const lyricsEmbedOne = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setDescription(lyrics.slice(0, lyrics.length / 2))
                .setColor("#80F906")
                .setFooter(`Lyrics (1) - ${Client.user.username}`, Client.user.avatarURL())
                message.channel.send(lyricsEmbedOne);

                const lyricsEmbedTwo = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL())
                .setDescription(lyrics.slice(lyrics.length / 2, lyrics.length))
                .setColor("#80F906")
                .setFooter(`Lyrics (2) - ${Client.user.username}`, Client.user.avatarURL())
                message.channel.send(lyricsEmbedTwo);
            }
        });
    }

    if (!queue) {
        return message.channel.send("No song is currently playing.");
    }
}
