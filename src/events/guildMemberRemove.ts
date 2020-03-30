import * as Discord from "discord.js";
import * as fs from "fs";

export default async (Client: Discord.Client, member: Discord.GuildMember) => {
	let savedWelcChan = fs.readFileSync("database/welcome/channels.json", "utf-8");
	savedWelcChan = JSON.parse(savedWelcChan);
	const channel: Discord.GuildChannel = savedWelcChan[member.guild.id] == undefined ? member.guild.channels.find((ch) => ch.name === "welcome") : member.guild.channels.get(savedWelcChan[member.guild.id]);

	if (!channel) {
		return;
	}

	const welcomeRichEmbed = new Discord.RichEmbed()
		.setTitle("A member just left the guild :outbox_tray:")
		.setDescription(`Goodbye ${member.user.username}. We hope you'll come back :confused:`)
		.setAuthor(member.user.username, member.user.avatarURL)
		.setFooter(Client.user.username, Client.user.avatarURL)
		.setColor("4F6A77")
	// @ts-ignore
	channel.send(welcomeRichEmbed);
};

