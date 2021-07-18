import * as Discord from "discord.js";
import * as Fs from "fs";
import * as path from "path";

export function SlashCommands(client: Discord.Client) {
    client.guilds.cache.get("833765854796972052").commands.fetch().then(cmd => cmd.forEach(cmd => {
        cmd.delete();
    }));

    let folders = ["fun"];
    let commandsArray: any[] = [];

    const commandFiles = Fs.readdirSync(path.join(__dirname, "..", "commands", folders[0])).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${folders[0]}/${file}`);

        let commandObject = {
            name: command.name,
            description: command.description
        }

        if (command.options) {
            Object.assign(commandObject, { options: command.options });
        }

        commandsArray.push(commandObject);
    }

    return client.guilds.cache.get("833765854796972052").commands.set(commandsArray);
};