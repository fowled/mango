import * as Discord from "discord.js";
import * as canvaslib from "canvas";

// Fun command

/**
 * Sends a mug, with the message author's profile pic
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const canvas = canvaslib.createCanvas(300, 250);
    const ctx = canvas.getContext("2d");
    const user = args[0] ? message.mentions.users.first() : message.member.user;

    const background = await canvaslib.loadImage("./assets/mug.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.beginPath(); // rounded profile pic
    ctx.arc(120, 120, 60, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await canvaslib.loadImage(user.displayAvatarURL);
    ctx.drawImage(avatar, 60, 60, 120, 120);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'canvas.png');

    message.channel.send(attachment);
}
