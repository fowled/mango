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
    const canvas = canvaslib.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const background = await canvaslib.loadImage("./assets/background.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = "35px Caviar Dreams"; // displays on the picture the member tag
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "left";
    ctx.fillText(`"${args.join(" ")}"`, 10, canvas.height / 1.5);

    ctx.font = "35px Caviar Dreams"; // displays on the picture the member tag
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "left";
    ctx.fillText(`${message.author.username} said:`, 10, canvas.height / 2);

    ctx.beginPath(); // rounded profile pic
    ctx.arc(630, 75, 60, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await canvaslib.loadImage(message.member.user.displayAvatarURL({ format: "jpg" }));
    ctx.drawImage(avatar, 570, 15, 120, 120);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'canvas.png');

    message.channel.send(attachment);
}

const info = {
    name: "canvas",
    description: "Write something on a beautiful picture",
    category: "fun",
    args: "none"
}

export { info };
