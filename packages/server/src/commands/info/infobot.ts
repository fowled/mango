import Discord from "discord.js";
import si from "systeminformation";
import moment from "moment";

// Infobot command

/**
 * Replies with some info about the bot host
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */

module.exports = {
	name: "infobot",
	description: "Get info about Mango's infrastructure",
	category: "info",

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction) {
		const discordVersion = (await import("discord.js")).version;
		let ramInfo: si.Systeminformation.MemData, os: si.Systeminformation.OsData;

		await si.mem().then((data) => (ramInfo = data));
		await si.osInfo().then((data) => (os = data));

		const info = new Discord.MessageEmbed()
			.setAuthor(interaction.user.username, interaction.user.displayAvatarURL())
			.setDescription("About **Mango's infrastructure**")
			.addField("Node version", process.version)
			.addField("Discord.js version", discordVersion)
			.addField("OS", os.distro)
			.addField("Memory", `${(ramInfo.total / 104853.2055).toFixed()} mb`)
			.addField("Uptime", moment.duration(Client.uptime).humanize())
			.addField("Stats", `» \`${await collectUsers()}\` users \n» \`${Client.guilds.cache.size}\` guilds`)
			.setColor("RANDOM")
			.setTimestamp()
			.setFooter(Client.user.username, Client.user.displayAvatarURL());
		interaction.editReply({ embeds: [info] });

		async function collectUsers() {
			let usersCount = 0;

			await Client.guilds.cache.map((guild) => {
				if (guild.memberCount === undefined) return;

				return usersCount += guild.memberCount;
			});

			return usersCount;
		}
	},
};
