const DISCORD = require("discord.js");
const BOT = new DISCORD.Client();

// Commande de modération

exports.run = (BOT, message, args, tools) => {
    var mentionnedUser = message.mentions.users.first();
    var member = message.guild.member(mentionnedUser);

    if (member && member.kickable) {
        var commande = message.content.split(" ");
        commande = commande.slice(2);
        commande = commande.join(" ");

        if (commande == "") {
            commande = "Pas de raison spécifiée";
        }

        date = new Date;
        reponse = new DISCORD.RichEmbed()
            .setTitle(`Warn pour l'utilisateur **${mentionnedUser.username}**`)
            .setDescription(`L'utilisateur **${mentionnedUser.tag}** a reçu un *warn* de la part de **${message.author.tag}** à la date __${date.toLocaleString()}__ avec la raison *"${commande}"*.`)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setThumbnail("https://images.discordapp.net/avatars/430546580114898945/ffece6ee4a939121d311051082fbf3fa.png?size=512")
            .setFooter(BOT.user.username, BOT.user.avatarURL)
            .setColor("#4292f4")
            .setTimestamp()
        message.channel.send(reponse);

        reponse2 = new DISCORD.RichEmbed()
            .setTitle(`Warn pour l'utilisateur **${mentionnedUser.username}**`)
            .setDescription(`Vous avez reçu un *warn* de la part de **${message.author.username}** à la date __${date.toLocaleString()}__ avec la raison *"${commande}"*.`)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setThumbnail("https://images.discordapp.net/avatars/430546580114898945/ffece6ee4a939121d311051082fbf3fa.png?size=512")
            .setFooter(BOT.user.username, BOT.user.avatarURL)
            .setColor("#4292f4")
            .setTimestamp()
        BOT.users.get(mentionnedUser.id).send(reponse2).catch(U_U => {
            message.channel.send(`Information : l'utilisateur **${mentionnedUser.tag}** n'accepte pas les dm venant de serveurs, et le message warn n'a pas pu être envoyé.`);
        });
    } else {
        message.reply("Vous n'avez pas les droits d'avertir cet utilisateur !");
    }


}