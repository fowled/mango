import * as Discord from "discord.js";
import * as fs from "fs";
import * as canvaslib from "canvas";

export default async (Client: Discord.Client, member: Discord.GuildMember) => {
	let savedWelcChan = fs.readFileSync("database/welcome/channels.json", "utf-8");
	savedWelcChan = JSON.parse(savedWelcChan);
	const channel: Discord.GuildChannelResolvable = savedWelcChan[member.guild.id] == undefined ? member.guild.channels.resolve("welcome") : member.guild.channels.resolveID(savedWelcChan[member.guild.id]);

	if (!channel) {
		return;
	}

	const canvas = canvaslib.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const background = await canvaslib.loadImage("./assets/leave_background.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = "35px Caviar Dreams"; // displays on the picture the member tag
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "center";
    ctx.fillText(`Goodbye \n${member.user.tag}`, canvas.width - 400, canvas.height / 2.3);

    ctx.font = "25px Caviar Dreams"; // displays on the picture the member tag
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "center";
    ctx.fillText(`Members: ${member.guild.members.cache.size}`, canvas.width - 200, canvas.height / 1.30);

    ctx.beginPath(); // rounded profile pic
    ctx.arc(85, 85, 60, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await canvaslib.loadImage(member.user.avatar);
    ctx.drawImage(avatar, 25, 25, 120, 120);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
	
	// @ts-ignore
	channel.send(attachment);
};

