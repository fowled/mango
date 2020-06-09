import * as Discord from "discord.js";
import { XMLHttpRequest } from "xmlhttprequest";
import Lyricist from 'lyricist';
import { getLyrics } from "genius-lyrics-api";
import getArtistTitle from 'get-artist-title';
import * as Hastebin from "../utils/PostToHastebin";
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
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const accessToken = process.env.ACCESS_TOKEN;
    const lyricist = new Lyricist(accessToken);
    const queue: any = ops.queue.get(message.guild.id);
    let songID;

    let [songArtist, songTitle] = getArtistTitle(queue.songs[0].title, {
        defaultArtist: queue.songs[0].author.name
    });

    const options = {
        apiKey: accessToken,
        title: songTitle,
        artist: songArtist,
        optimizeQuery: true
    };

    console.log(songArtist, songTitle);
    
    getLyrics(options).then(lyrics => console.log(lyrics));

    /* console.log(artist, title);

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let parsed = JSON.parse(this.responseText);
            songID = parsed.response.hits[0].result.id;
            getLyrics(songID);
        } else if (this.readyState == 4 && this.status != 200) {
            return message.channel.send("I didn't find lyrics for that song.");
        }
    };

    xhttp.open("GET", `https://api.genius.com/search?q=${title}%20${artist}`, true);
    xhttp.setRequestHeader("Authorization", "Bearer OhiRMMNRCpeXUnJOzlDroXAznwszBz6YZ0gcVFa1Mmj4_ZYuasCul7X-LusYs5fy")
    xhttp.send();

    async function getLyrics(songid) {
        const song = await lyricist.song(songid, { fetchLyrics: true });

        Hastebin.postText(song.lyrics).then(res => {
            message.channel.send(res);
        });

        /* message.channel.send(song.lyrics.slice(0, song.lyrics.length / 2));
        message.channel.send(song.lyrics.slice(song.lyrics.length / 2, song.lyrics.length));
    } */

    if (!queue) {
        return message.channel.send("No song is currently playing.");
    }
}
