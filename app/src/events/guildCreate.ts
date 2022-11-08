import Discord from "discord.js";

import { supabase } from "index";

import { error } from "utils/logger";

module.exports = {
    name: "guildCreate",
    async execute(Client: Discord.Client, guild: Discord.Guild) {
        await supabase.from("guilds").insert({ guild_id: guild.id });

        const fetchUsersFromDB = await supabase.from("users").select("user_id");
        const fetchUsersFromGuild = (await guild.members.fetch()).map(user => user.id);

        const findSamePeople = fetchUsersFromDB.data.filter(value => fetchUsersFromGuild.includes(value.user_id));

        if (findSamePeople?.length) {
            for (const user of findSamePeople) {
                const fetchAllGuilds = await supabase.from("users").select("guilds").like("user_id", user.user_id).single();

                await supabase.from("users").update({ guilds: [...fetchAllGuilds.data.guilds, guild.id] }).like("user_id", user.user_id);
            }
        }

        const guildOwner = await guild.fetchOwner();

        if (!guild.members.cache.get(Client.user.id).permissions.has(["UseApplicationCommands"])) {
            return guildOwner.send("Hey! Thanks for adding me to the server. It looks like I can't use slash commands, which is required for my commands to work. Please reinvite me and enable this permission.").catch((err) => {
                error(err);
            });
        }
    },
};
