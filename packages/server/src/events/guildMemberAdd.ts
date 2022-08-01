import Discord from "discord.js";
import canvaslib from "canvas";

import { prisma } from "../index";

import { error } from "../utils/logger";

module.exports = {
	name: "guildMemberAdd",
	async execute(Client: Discord.Client, member: Discord.GuildMember) {
		const welcomechannel = await prisma.welChannels.findUnique({ where: { idOfGuild: member.guild.id } });

		if (!welcomechannel) return;

		const channel = (await Client.channels.fetch(welcomechannel.idOfChannel)) as Discord.TextChannel;
		const fetchNumberOfMembers = member.guild.memberCount;

		const canvas = canvaslib.createCanvas(700, 250);
		const ctx = canvas.getContext("2d");

		const background = await canvaslib.loadImage("./assets/images/background.png");

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.font = "35px Caviar Dreams";
		ctx.fillStyle = "#ffffff";
		ctx.textAlign = "left";
		ctx.fillText(`Welcome to the server! \nWe're now ${fetchNumberOfMembers} members.`, 10, canvas.height / 2.5);

		ctx.font = "27px Caviar Dreams";
		ctx.fillText(`${member.user.tag}`, 10, canvas.height / 1.15);

		ctx.beginPath();
		ctx.arc(630, 75, 60, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		const avatar = await canvaslib.loadImage(member.user.displayAvatarURL({ format: "jpg" }));

		ctx.drawImage(avatar, 570, 15, 120, 120);

		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome.png");

		const embed = new Discord.MessageEmbed()
			.setAuthor(member.user.tag, member.user.displayAvatarURL())
			.setDescription(`:wave: Welcome ${member} to **${member.guild.name}**!`)
			.setImage("attachment://welcome.png")
			.setColor("#808080");

		try {
			channel.send({ embeds: [embed], files: [attachment] });
		} catch (err) {
			error("Didn't find the channel to post attachment [guildMemberAdd]");
		}
	},
};
