import Discord from 'discord.js';

import { insertLog } from 'utils/logChecker';

module.exports = {
    name: 'channelCreate',
    async execute(Client: Discord.Client, channel: Discord.GuildChannel) {
        await insertLog(Client, channel.guild.id, Client.user, `A ${channel.type} channel has been created: ${channel}`);
    },
};
