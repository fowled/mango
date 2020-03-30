import * as Discord from "discord.js";
import * as fs from "fs";

export default async (Client: Discord.Client, member: Discord.GuildMember) => {
	let savedWelcChan = fs.readFileSync("database/welcome/channels.json", "utf-8");
	savedWelcChan = JSON.parse(savedWelcChan);
	const welcomeChannel: Discord.GuildChannel = savedWelcChan[member.guild.id] == undefined ? member.guild.channels.find((ch) => ch.name === "welcome") : member.guild.channels.get(savedWelcChan[member.guild.id]);

	if (!welcomeChannel) {
		return;
	}

	const welcomeRichEmbed = new Discord.RichEmbed()
		.setTitle("A member just joined the guild :inbox_tray:")
		.setDescription(`Welcome ${member}! We wish you to have fun in **${member.guild.name}**. Help message: type *!infohelp* in server!`)
		.setAuthor(member.user.username, member.user.avatarURL)
		.setFooter(Client.user.username, Client.user.avatarURL)
		.setColor("0FB1FB")
	// @ts-ignore
	welcomeChannel.send(welcomeRichEmbed);

	const welcUserRichEmbed = new Discord.RichEmbed()
		.setTitle("Welcome!")
		.setDescription(`Welcome ${member}! We wish you to have fun in **${member.guild.name}**. Help message: type *!infohelp* in server!`)
		.setAuthor(member.user.username, member.user.avatarURL)
		.setFooter(Client.user.username, Client.user.avatarURL)
		.setColor("0FB1FB")
	Client.users.get(member.id).send(welcUserRichEmbed);
};
