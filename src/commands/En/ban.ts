import * as Discord from "discord.js";

// Moderation command

exports.run = (client, message, args, tools) => {

    var reason = message.content.split(" ").slice(2).join(" ");
    //reason = reason.join(" ");
    
    if (reason == "") {
        reason = "No reason provided";
    }

    const userBan = message.mentions.users.first();
    const memberBan = message.guild.member(userBan);

    if (memberBan) {
        var banMessageAuthor = message.author.tag;
        var banGuildName = message.member.guild.name;
        var guildIcon = message.member.guild.iconURL;
        var bannedUserId = userBan.id;
        var date = new Date;

        if (memberBan.bannable && memberBan.id != "352158391038377984") {
            const banMessageUser = new Discord.RichEmbed()
                .setTitle(`Banned!`)
                .setDescription(`You have been banned from the server **${banGuildName}** by *${banMessageAuthor}* on date __${date.toLocaleTimeString()}__! Reason: *"${reason}"*`)
                .setTimestamp()
                .setThumbnail(guildIcon)
                .setColor("#4292f4")
                .setFooter(client.user.username, client.user.avatarURL)
            client.users.get(bannedUserId).send(banMessageUser);
        }

        setTimeout(function () {
            if (memberBan.id != "352158391038377984") {
                memberBan.ban({
                    reason: reason,
                }).then(() => {
                    const banMessageGuild = new Discord.RichEmbed()
                        .setTitle(`User **${userBan.username}** is now banned!`)
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription(`:white_check_mark: **${memberBan.user.tag}** is now banned (*${reason}*)!`)
                        .setTimestamp()
                        .setColor("#4292f4")
                        .setFooter(client.user.username, client.user.avatarURL)
                    message.channel.send(banMessageGuild);

                }).catch(err => {
                    const banMessageError = new Discord.RichEmbed()
                        .setTitle('Error')
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription(`An error has occured while banning **${memberBan.user.tag}**; missing permissions. Please, I am a serious bot, I can have admin rank!`)
                        .setTimestamp()
                        .setColor("#FF0000")
                        .setFooter(client.user.username, client.user.avatarURL)
                    message.channel.send(banMessageError);
                    console.log(err);
                });
            } else {
                const banMessageCreator = new Discord.RichEmbed()
                    .setTitle(`Herm...`)
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setDescription(`You can't ban me, I'm the bot developer!`)
                    .setTimestamp()
                    .setThumbnail("")
                    .setColor("#FF0000")
                    .setFooter(client.user.username, client.user.avatarURL)
                message.channel.send(banMessageCreator);
            }
        }, 500);
    } else {
        message.reply('Whoops, please select a member. Ban hammer is waiting!');
    }

}