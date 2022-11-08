import Discord from "discord.js";
import chalk from "chalk";

import { supabase } from "index";

import { log } from "utils/logger";

module.exports = {
    name: "ready",
    once: true,

    async execute(Client: Discord.Client) {
        let currentStatus = 0;

        switchStatuses();

        setInterval(switchStatuses, 10 * 60000);

        log(`${chalk.yellow("logged in")} as ${chalk.magentaBright(Client.user.username)}`);

        await bootupChecks();

        function switchStatuses() {
            const statuses = [
                { name: "/help", type: Discord.ActivityType.Watching },
                {
                    name: `${Client.guilds.cache.size.toString()} guilds`,
                    type: Discord.ActivityType.Competing,
                },
            ];

            Client.user.setActivity(statuses[currentStatus].name, {
                type: statuses[currentStatus].type as Discord.ActivityType.Competing | Discord.ActivityType.Watching,
            });

            currentStatus === 0 ? currentStatus++ : currentStatus--;
        }

        async function bootupChecks() {
            const fetchCurrentGuilds = await supabase.from("guilds").select("guild_id");

            const addedGuilds = Client.guilds.cache.map(guild => guild.id).filter(x => !fetchCurrentGuilds.data.map(guild => guild.guild_id).includes(x));
            const removedGuilds = fetchCurrentGuilds.data.map(guild => guild.guild_id).filter(x => !Client.guilds.cache.map(guild => guild.id).includes(x));

            if (!addedGuilds.length && !removedGuilds.length) return;

            for (const guild of addedGuilds) {
                const users = await supabase.from("users").select();

                for (const user of users.data) {
                    if (!await isInGuild(user.user_id, guild)) return;

                    await supabase.from("users").update({ guilds: [...user.guilds, guild] }).like("user_id", user.user_id);
                }

                await supabase.from("guilds").insert({ guild_id: guild });
            }

            for (const guild of removedGuilds) {
                const findPeopleInGuild = await supabase.from("users").select().contains("guilds", [guild]);

                for (const user of findPeopleInGuild.data) {
                    const removeGuild = user.guilds.filter(item => item !== guild);

                    await supabase.from("users").update({ guilds: removeGuild }).like("user_id", user.user_id);
                }

                await supabase.from("guilds").delete().like("guild_id", guild);
            }

            return log(`${chalk.greenBright("joined")} ${chalk.yellow(addedGuilds.length)} ${chalk.blueBright("guild(s)")} and ${chalk.red("left")} ${chalk.yellow(removedGuilds.length)} ${chalk.blueBright("guild(s)")}`);
        }

        async function isInGuild(userId: string, guild: string) {
            const getGuild = await Client.guilds.fetch(guild);

            return await getGuild.members.fetch(userId);
        }
    },
};