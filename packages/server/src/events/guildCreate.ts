import Discord from "discord.js";

import { error } from "utils/logger";

module.exports = {
	name: "guildCreate",
	async execute(Client: Discord.Client, guild: Discord.Guild) {
		const guildOwner = await guild.fetchOwner();

		if (!guild.members.cache.get(Client.user.id).permissions.has(["USE_APPLICATION_COMMANDS"])) {
			return guildOwner
				.send("Hey! Thanks for adding me to the server. It looks like I can't use slash commands, which is required for my commands to work. Please reinvite me and enable this permission.")
				.catch((err) => {
					error(err);
				});
		}
	},
};
