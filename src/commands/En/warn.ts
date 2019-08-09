import * as Discord from "discord.js";

// Mod command

/**
 * Permet de warn un utilisateur
 * @param {Discord.Client} Client le client
 * @param {Discord.Message} Message le message contenant la commande
 * @param {string[]} args les arguments de la commande
 * @param {any} options les options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: void) {
    var mentionnedUser = message.mentions.users.first();
    var member = message.guild.member(mentionnedUser);
    
    if (member && member.kickable) {
        var commande = message.content.split(" ").slice(2).join(" ");
    
        if (commande == "") {
            commande = "Pas de raison spécifiée"; // on a les args pour ça, verrai après
        }
    
        const date = new Date;
        var warnGuildRichEmbed = new Discord.RichEmbed()
            .setTitle(`Warn`)
            .setDescription(`**${mentionnedUser.tag}** has been warned by *${message.author.tag}* on __${date.toLocaleDateString()}__: *"${commande}"*.`)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setFooter(Client.user.username, Client.user.avatarURL)
            .setColor("#4292f4")
            .setTimestamp()
        message.channel.send(warnGuildRichEmbed);
    
        var warnUserRichEmbed = new Discord.RichEmbed()
            .setTitle(`Warn`)
            .setDescription(`You have been warned by **${message.author.username}**  __${date.toLocaleString()}__ avec la raison *"${commande}"*.`)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setFooter(Client.user.username, Client.user.avatarURL)
            .setColor("#4292f4")
            .setTimestamp()
        Client.users.get(mentionnedUser.id).send(warnUserRichEmbed).catch(U_U => {
            message.channel.send(`Information : l'utilisateur **${mentionnedUser.tag}** n'accepte pas les dm venant de serveurs, et le message warn n'a pas pu être envoyé.`);
        });
    } else {
        message.reply("Vous n'avez pas les droits d'avertir cet utilisateur !");
    }
    
}