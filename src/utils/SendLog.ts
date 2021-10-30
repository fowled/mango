import * as Discord from "discord.js";

export function logCommand(Client: Discord.Client, cmd: Discord.MessageEmbed) {
    Client.channels.fetch("894988913976959009").then((channel: Discord.TextChannel) => {
        channel.send({ embeds: [cmd] });
    });
}

export function logError(Client: Discord.Client, err: Discord.MessageEmbed) {
    Client.channels.fetch("894988848042491965").then((channel: Discord.TextChannel) => {
        channel.send({ embeds: [err] });
    });
}
