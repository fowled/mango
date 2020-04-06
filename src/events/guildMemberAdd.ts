import * as Discord from "discord.js";
import * as fs from "fs";
import * as canvaslib from "canvas";

export default async (Client: Discord.Client, member: Discord.GuildMember) => {
	let savedWelcChan = fs.readFileSync("database/welcome/channels.json", "utf-8");
	savedWelcChan = JSON.parse(savedWelcChan);
	const welcomeChannel: Discord.GuildChannel = savedWelcChan[member.guild.id] == undefined ? member.guild.channels.find((ch) => ch.name === "welcome") : member.guild.channels.get(savedWelcChan[member.guild.id]);

	if (!welcomeChannel) {
		return;
	}

	const welcUserRichEmbed = new Discord.RichEmbed()
		.setTitle("Welcome!")
		.setDescription(`Welcome ${member}! We wish you to have fun in **${member.guild.name}**. Help message: type *!infohelp* in server!`)
		.setAuthor(member.user.username, member.user.avatarURL)
		.setFooter(Client.user.username, Client.user.avatarURL)
		.setColor("0FB1FB")
	Client.users.get(member.id).send(welcUserRichEmbed);

    const canvas = canvaslib.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const background = await canvaslib.loadImage("./background.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = "35px Caviar Dreams"; // displays on the picture the member tag
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "center";
    ctx.fillText(`Welcome \n${member.user.tag}`, canvas.width - 400, canvas.height / 2.3);

    ctx.font = "25px Caviar Dreams"; // displays on the picture the member tag
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "center";
    ctx.fillText(`Member #${member.guild.members.size}`, canvas.width - 200, canvas.height / 1.30);

    ctx.beginPath(); // rounded profile pic
    ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await canvaslib.loadImage(member.user.displayAvatarURL);
    ctx.drawImage(avatar, 25, 25, 100, 100);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

	// @ts-ignore
	welcomeChannel.send(attachment);
};
