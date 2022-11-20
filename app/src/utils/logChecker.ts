import Discord from "discord.js";

import { supabase } from "index";

import { warn } from "./logger";

export async function insertLog(Client: Discord.Client, guildID: string, author: Discord.User, msg: string) {
    const logchannel = await supabase.from("guilds").select().like("guild_id", guildID).single();

    if (!logchannel) return;

    const logChannelID = logchannel.data.logs;

    const logMessageEmbed = new Discord.EmbedBuilder().setAuthor({ name: author.tag, iconURL: author.avatarURL() }).setColor("#2D2B2B").setDescription(msg).setFooter({ text: Client.user.username, iconURL: Client.user.avatarURL() }).setTimestamp();

    try {
        await ((await Client.channels.fetch(logChannelID)) as Discord.TextChannel).send({
            embeds: [logMessageEmbed],
        });
    } catch (e) {
        warn(e);
    }
}
