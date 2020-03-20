import * as Discord from "discord.js";

import * as Logger from "./../utils/Logger";

export default async (Client: Discord.Client) => {
    const date = new Date();
    Logger.log(`${date.toLocaleString()} - Attempting to reconnect the bot...`);
};