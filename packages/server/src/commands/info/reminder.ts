import Discord from "discord.js";
import ms from "ms";

// Fun command

/**
 * Sets reminders, for you.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "reminder",
	description: "Set a reminder with Mango",
	category: "info",

	options: [
		{
			name: "duration",
			type: "STRING",
			description: "The time to wait before sending you the reminder",
			required: true,
		},

		{
			name: "content",
			type: "STRING",
			description: "The reminder's content",
			required: true,
		},
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction, args: string[]) {
		const time = args[0];
		const content = args.slice(1, args.length).join(" ");
		const date = new Date();

		if (!ms(time)) {
			return interaction.editReply("<:no:835565213322575963> The duration must follow this format - `50s`, `10m` or `10h`.");
		}

		const reminderEmbed = new Discord.MessageEmbed()
			.setTitle("Reminder")
			.setAuthor(interaction.user.tag, interaction.user.avatarURL())
			.setDescription(`Reminder **${content}** successfully saved - we'll send you a dm in ${ms(ms(time))} <:yes:835565213498736650>`)
			.setColor("#08ABF9")
			.setFooter(Client.user.username, Client.user.avatarURL())
			.setTimestamp();

		interaction.editReply({ embeds: [reminderEmbed] });

		setTimeout(function () {
			const reminderAuthor = new Discord.MessageEmbed()
				.setTitle("Ding dong...")
				.setAuthor(interaction.user.tag, interaction.user.avatarURL())
				.setDescription(`It's time to **${content}** - *reminder saved at ${date.toLocaleString()}.*`)
				.setColor("#08ABF9")
				.setFooter(Client.user.username, Client.user.avatarURL())
				.setTimestamp();

			interaction.user.send({ embeds: [reminderAuthor] }).catch(() => {
				interaction.channel.send(`<:no:835565213322575963> ${interaction.user} I couldn't send you the message as your private messages are turned off.`);
			});
		}, ms(time));
	},
};
