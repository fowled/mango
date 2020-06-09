import * as Discord from "discord.js";
import * as fs from "fs";
import * as canvaslib from "canvas";
import * as Logger from "../utils/Logger";

export default async (Client: Discord.Client, member: Discord.GuildMember) => {
	let savedWelcChan = fs.readFileSync("database/welcome/channels.json", "utf-8");
	savedWelcChan = JSON.parse(savedWelcChan);
	const welcomeChannel = savedWelcChan[member.guild.id] == undefined ? member.guild.channels.cache.get("welcome").id : savedWelcChan[member.guild.id];

	if (!welcomeChannel) {
		return;
	}

	const welcUserMessageEmbed = new Discord.MessageEmbed()
		.setTitle("Welcome!")
		.setDescription(`Welcome ${member}! We wish you to have fun in **${member.guild.name}**. Help message: type *ma!help* in server!`)
		.setAuthor(member.user.username, member.user.avatar)
		.setFooter(Client.user.username, Client.user.avatar)
		.setColor("0FB1FB")
	member.send(welcUserMessageEmbed);

    const canvas = canvaslib.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const background = await canvaslib.loadImage("./assets/background.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = "35px Caviar Dreams"; // displays on the picture the member tag
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "center";
    ctx.fillText(`Welcome \n${member.user.tag}`, canvas.width - 400, canvas.height / 2.3);

    ctx.font = "25px Caviar Dreams"; // displays on the picture the member tag
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "center";
    ctx.fillText(`Member #${member.guild.members.cache.size}`, canvas.width - 200, canvas.height / 1.30);

    ctx.beginPath(); // rounded profile pic
    ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await canvaslib.loadImage(member.user.avatar);
    ctx.drawImage(avatar, 25, 25, 100, 100);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    try {
        Client.channels.fetch(welcomeChannel).then((channel: Discord.TextChannel) => channel.send(attachment));
    } catch (err) {
        Logger.error("Didn't find the channel to post attachment [guildMemberAdd]");
    }
};
