import * as Discord from "discord.js";

// Member command

/**
 * Affiche les infos sur un utilisteur
 * @param {Discord.Client} Client le client
 * @param {Discord.Message} Message le message contenant la commande
 * @param {string[]} args les arguments de la commande
 * @param {any} options les options
 */

export async function run(Client: Discord.Client, message: Discord.Message , args: string[], options: any): Promise<void> {

    const selectedUser: Discord.User = message.mentions.users.size > 0 ? (message.guild.member(message.mentions.users.first()) ? message.mentions.users.first() : null) : message.author;

    if (selectedUser) { // dans le même serveur
        var userinfoRichEmbed: Discord.RichEmbed = new Discord.RichEmbed()
            .setTitle(`User information for ${selectedUser.username}`)
            .setAuthor(selectedUser.username, selectedUser.avatarURL)
            .setDescription("User information")
            .setThumbnail(selectedUser.avatarURL)
            .setTimestamp()
            .addField("Username", selectedUser.username, true)
            .addField("Tag", selectedUser.discriminator, true)
            .addField("ID", selectedUser.id, true)
            .addField("Status", selectedUser.presence.status, true)
            .addField("Game status", selectedUser.presence.game ? selectedUser.presence.game.name : "Not currently playing any game", true);
        if (message.guild.member(message.mentions.users.first())) {
            userinfoRichEmbed.addField("Arrival date", message.guild.member(selectedUser).joinedAt.toLocaleString())
            .addField("Roles owned in the server", message.guild.member(selectedUser).roles.array().splice(1).map(role => role.name).length === 0 ? "This user has no role" : message.guild.member(selectedUser).roles.array().splice(1).map(role => role.name).join(", "));
        }
        userinfoRichEmbed.addField("The date the account was created", selectedUser.createdAt.toLocaleString())
            .setColor(Math.floor(Math.random() * 16777214) + 1)
            .setFooter(Client.user.username, Client.user.avatarURL);
            
        message.channel.send(userinfoRichEmbed);
    } else {
        message.channel.send("Tagged user is not in the server :frowning:");
    }
}