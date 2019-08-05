import * as Discord from "discord.js";

// Member command

export async function run(Client: Discord.Client, message: Discord.Message , args: string[], options: any) {

    const userInfo = message.mentions.users.first();
    if (userInfo) {
        const memberInfo = message.guild.member(userInfo);
        var userGameStatus = userInfo.presence.game;

        if (memberInfo) {
            var userRoles: string[];

            memberInfo.roles.forEach(role => userRoles.push(role.name));

            userRoles.shift();

            if (userRoles.length == 0) {
                var userRolesRichEmbed = "This user has no role.";
            } else {
                var userRolesRichEmbed = userRoles.join(", ")
            }

            if (!userGameStatus) {
                var userGameStatusRichEmbed = "This user has no game";
            }

            var userinfoRichEmbed = new Discord.RichEmbed()
                .setTitle(`User information for ${userInfo.username}`)
                .setAuthor(userInfo.username, userInfo.avatarURL)
                .setDescription("User information")
                .setThumbnail(userInfo.avatarURL)
                .setTimestamp()
                .addField("Username", userInfo.username, true)
                .addField("Tag", userInfo.discriminator, true)
                .addField("ID", userInfo.id, true)
                .addField("Status", userInfo.presence.status, true)
                .addField("Game status", userGameStatusRichEmbed, true)
                .addField("Arrival date", memberInfo.joinedAt.toLocaleString())
                .addField("Roles owned in the server", userRolesRichEmbed)
                .addField("The date the account was created", userInfo.createdAt.toLocaleString())
                .setColor(Math.floor(Math.random() * 16777214) + 1)
                .setFooter(Client.user.username, Client.user.avatarURL)
            message.channel.send(userinfoRichEmbed);
        } else {
            message.channel.send("Tagged user is not in the server :frowning:");
        }

    } else {
        var userRoles: string[];
        var userPresence = message.author.presence.game;

        message.member.roles.forEach(role => userRoles.push(role.name));

        userRoles.shift();

        if (userRoles.length == 0) {
            userRolesRichEmbed = "You don't have any role in the server";
        } else {
            userRolesRichEmbed = userRoles.join(", ");
        }

        if (!userPresence) {
            var userPresenceRichEmbed = "You don't have any active game on your PC.";
        }

        var userinfoRichEmbedYourself = new Discord.RichEmbed()
            .setTitle(`User information for ${message.author.username}`)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setDescription("User information")
            .setThumbnail(message.author.avatarURL)
            .setTimestamp()
            .addField("Username", message.author.username, true)
            .addField("Tag", message.author.discriminator, true)
            .addField("ID", message.author.id)
            .addField("Status", message.member.presence.status, true)
            .addField("Game status", userPresenceRichEmbed, true)
            .addField("Arrival date", message.member.joinedAt.toLocaleString())
            .addField("Roles owned in the server", userRolesRichEmbed)
            .addField("The date the account was created on", message.author.createdAt.toLocaleString())
            .setColor(Math.floor(Math.random() * 16777214) + 1)
            .setFooter(Client.user.username, Client.user.avatarURL)
        message.channel.send(userinfoRichEmbedYourself);
    }
}