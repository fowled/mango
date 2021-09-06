import * as Discord from "discord.js";
import * as Fs from "fs";
import * as path from "path";

export async function SlashCommands(client: Discord.Client) {
    await client.application.commands.fetch().then(cmd => cmd.forEach(cmd => {
        cmd.delete();
    }));

    const interactionFolders = Fs.readdirSync(path.join(__dirname, "..", "commands"));

    for (const folder of interactionFolders) {
        const commandFiles = Fs.readdirSync(path.join(__dirname, "..", "commands", folder)).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);

            let commandObject = {
                name: command.name,
                description: command.description
            }

            if (command.options) {
                Object.assign(commandObject, { options: command.options });
            }

            await client.application.commands.create(commandObject);
        }
    }
};