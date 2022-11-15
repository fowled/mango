import Discord from "discord.js";

import { supabase } from "index";

module.exports = {
    name: "guildDelete",
    async execute(Client: Discord.Client, guild: Discord.Guild) {
        await supabase.from("guilds").delete().like("guild_id", guild.id);

        const findPeopleInGuild = await supabase.from("users").select().contains("guilds", [guild.id]);

        await Promise.all(findPeopleInGuild.data.map(async (user) => {
            const removeGuild = user.guilds.filter(item => item !== guild.id);

            await supabase.from("users").update({ guilds: removeGuild }).like("user_id", user.user_id);
        }));
    },
};
