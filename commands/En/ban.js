const DISCORD = require("discord.js");

// Moderation command

exports.run = (client, message, args, tools) => {

    var reason = args[2].join(" ");

    if (reason == "") {
        reason = "No reason provided";
    }

    const userBan = message.mentions.users.first();
    const memberBan = message.guild.member(userBan);

    if (memberBan) {
        var banMessageAuthor = message.author.tag;
        var banGuildName = message.member.guild.name;
        var guildIcon = message.member.guild.iconURL;
        var bannedUserId = user.id;
        var date = new Date;

        if (memberBan.bannable && memberBan.id != "352158391038377984") {
            reponse = new DISCORD.RichEmbed()
                .setTitle(`Ban from the server **${banGuildName}**, on the date __${date.toLocaleTimeString()}__`)
                .setDescription(`You have been banned from the server **${banGuildName}** by **${banMessageAuthor}** on the date __${date}__! Reason: *"${reason}"*`)
                .setTimestamp()
                .setThumbnail(guildIcon)
                .setColor("#4292f4")
                .setFooter(BOT.user.username, BOT.user.avatarURL)
            BOT.users.get(bannedUserId).send(reponse);
        }

        setTimeout(function () {
            if (memberBan.id != "352158391038377984") {
                memberBan.ban({
                    reason: reason,
                }).then(() => {
                    banMessageGuild = new DISCORD.RichEmbed()
                        .setTitle(`User **${userBan.username}** is now banned!`)
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription(`:white_check_mark: **${memberBan.user.tag}** is now banned (*${reason}*)!`)
                        .setTimestamp()
                        .setColor("#4292f4")
                        .setFooter(BOT.user.username, BOT.user.avatarURL)
                    message.channel.send(reponse2);

                }).catch(err => {
                    reponse = new DISCORD.RichEmbed()
                        .setTitle(`Error`)
                        .setAuthor(message.author.username, message.author.avatarURL)
                        .setDescription(`An error has occured while banning **${memberBan.user.tag}**; missing permissions. Please, I am a serious bot, I can have admin rank!`)
                        .setTimestamp()
                        .setColor("#FF0000")
                        .setFooter(BOT.user.username, BOT.user.avatarURL)
                    message.channel.send(reponse);
                    console.log(err);
                });
            } else {
                reponse = new DISCORD.RichEmbed()
                    .setTitle(`Herm...`)
                    .setAuthor(message.author.username, message.author.avatarURL)
                    .setDescription(`You can't ban me, I'm the bot developer!`)
                    .setTimestamp()
                    .setThumbnail("")
                    .setColor("#FF0000")
                    .setFooter(BOT.user.username, BOT.user.avatarURL)
                message.channel.send(reponse);
            }
        }, 500);
    } else {
        message.reply('Whoops, please select a member. Ban hammer is waiting!');
    }

}