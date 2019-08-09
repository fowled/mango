import * as Discord from "discord.js";

// Moderation command

exports.run = (BOT, message, args, tools) => {
    const user = message.mentions.users.first();
    if (user) {
        const member = message.guild.member(user);
        var reason = message.content.split(" ");
        reason = reason.slice(2);
        reason = reason.join(" ");
        if (reason == "") {
            reason = "No reason provided";
        }
        if (member) {
            var kickMessageAuthor = message.author.username;
            var kickGuildName = message.member.guild.name;
            var guildIcon = message.member.guild.iconURL;
            var kickedUserId = user.id;
            var date = new Date;
            if (member.kickable && member.id != "352158391038377984") {
                const kickMessageUser = new Discord.RichEmbed()
                    .setTitle(`Kicked!`)
                    .setDescription(`You have been kicked from the server **${kickGuildName}** by *${kickMessageAuthor}* on date __${date.toLocaleDateString()}__ ! Reason: *"${reason}"*`)
                    .setTimestamp()
                    .setThumbnail(guildIcon)
                    .setColor("#4292f4")
                    .setFooter(BOT.user.username, BOT.user.avatarURL)
                BOT.users.get(kickedUserId).send(kickMessageUser);
            }

            setTimeout(function () {
                member.kick(reason).then(() => {
                    const kickMessageGuild = new Discord.RichEmbed()
                        .setTitle(`User ${user.username} has been kicked from the guild!`)
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription(`:white_check_mark: **${user.tag}** is now kicked (*${reason}*)!`)
                        .setTimestamp()
                        .setColor("#4292f4")
                        .setFooter(BOT.user.username, BOT.user.avatarURL)
                    message.channel.send(kickMessageGuild);
                }).catch(err => {
                    const kickMessageError = new Discord.RichEmbed()
                        .setTitle('Error')
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription(`An error has occured while kicking **${user.tag}**; missing permissions. Make sure I have admin perms, then I promise I'll take the hammer!`)
                        .setTimestamp()
                        .setColor("#FF0000")
                        .setFooter(BOT.user.username, BOT.user.avatarURL)
                    message.channel.send(kickMessageError);
                    console.log(err);
                });
            }, 750);
        } else {
            message.reply("Boop! A super rare unknown error has occured. Maybe the user you tried to kick isn't in the server...?");
        }
    } else {
        message.reply("Please select a member :wink:");
    }
}