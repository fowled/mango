import * as Discord from "discord.js";
import { hypixelClient } from "../../index";

// Scratch command

/**
 * Shows information about a Hypixel player.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "player",
    description: "Shows information about a Hypixel player",
    category: "api",
    options: [
        {
            name: "player",
            type: "STRING",
            description: "The player's username or UUID",
            required: true
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[]) {
        await hypixelClient.getPlayer(args[0], { guild: true }).then(player => {
            const firstLoggedOn: number = Math.round(new Date(player.firstLoginTimestamp).getTime() / 1000);
            const lastLoggedOn: number = Math.round(new Date(player.lastLoginTimestamp).getTime() / 1000);

            const embed: Discord.MessageEmbed = new Discord.MessageEmbed()
                .setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
                .setColor("LUMINOUS_VIVID_PINK")
                .setTitle(player.rank !== "Default" ? `[${player.rank}] ${player.nickname}` : player.nickname)
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?size=256&default=MHF_Steve&overlay`)
                .setURL(`https://shmeado.club/player/stats/${player.nickname}`)
                .addField("Network level", `Level \`${player.level}\``, true)
                .addField("Guild", player.guild ? `\`${player.guild.name}\`` : "`none`", true)
                .addField("Status", player.isOnline ? "online" : "offline", true)
                .addField("First logged on", `<t:${firstLoggedOn}:d>`, true)
                .addField("Last logged on", `<t:${lastLoggedOn}:d>`, true)
                .addField("Karma", `\`${player.karma}\``, true)
                .addField("Recent game", player.recentlyPlayedGame.name, true)
                .addField("Language", player.userLanguage, true)
                .addField("Version", player.mcVersion ? player.mcVersion : "unknown", true)
                .setFooter(Client.user.username, Client.user.avatarURL())
            interaction.editReply({ embeds: [embed] });

            console.log(player);
        }).catch(() => {
            return interaction.editReply(`<:no:835565213322575963> Couldn't find the player with nickname \`${args[0]}\`.`);
        });
    }

}
