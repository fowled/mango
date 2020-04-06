import * as Discord from "discord.js";
import * as canvaslib from "canvas";

// Fun command

/**
 * Draws something.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const member = message.mentions.members.first();
    const canvas = canvaslib.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const background = await canvaslib.loadImage("./leave_background.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = "35px Caviar Dreams"; // displays on the picture the member tag
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "center";
    ctx.fillText(args.join(" "), canvas.width / 2, canvas.height / 2);

    ctx.beginPath(); // rounded profile pic
    ctx.arc(85, 85, 60, 0, Math.PI * 2, true);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.closePath();
    ctx.clip();

    const avatar = await canvaslib.loadImage(message.member.user.displayAvatarURL);
    ctx.drawImage(avatar, 25, 25, 120, 120);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'canvas.png');

    message.channel.send(attachment);
}
