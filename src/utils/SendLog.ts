import * as Discord from "discord.js";

const cmdChannel: string = process.env.CMD_CHANNEL;
const errChannel: string = process.env.ERR_CHANNEL;

export function logCommand(Client: Discord.Client, cmd: Discord.MessageEmbed) {
    Client.channels.fetch(cmdChannel).then((channel: Discord.TextChannel) => {
        channel.send({ embeds: [cmd] });
    });
}

export function logError(Client: Discord.Client, err: Discord.MessageEmbed) {
    Client.channels.fetch(errChannel).then((channel: Discord.TextChannel) => {
        channel.send({ embeds: [err] });
    });
}
