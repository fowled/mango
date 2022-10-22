import Discord from "discord.js";
import chalk from "chalk";

import { log } from "utils/logger";

module.exports = {
    name: "ready",
    once: true,

    async execute(Client: Discord.Client) {
        let currentStatus = 0;

        const statuses = [
            { name: "/help", type: Discord.ActivityType.Watching },
            {
                name: `${Client.guilds.cache.size.toString()} guilds`,
                type: Discord.ActivityType.Competing,
            },
        ];

        function switchStatuses() {
            Client.user.setActivity(statuses[currentStatus].name, {
                type: statuses[currentStatus].type as Discord.ActivityType.Competing | Discord.ActivityType.Watching,
            });

            currentStatus === 0 ? currentStatus++ : currentStatus--;
        }

        switchStatuses();

        setInterval(switchStatuses, 10 * 60000);

        log(`${chalk.yellow("logged in")} as ${chalk.magentaBright(Client.user.username)}`);
    },
};
