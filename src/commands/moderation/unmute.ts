import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";

// Moderation command

/**
 * Mutes a user
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "unmute",
    description: "Unmutes a user",
    category: "moderation",
    options: [
        {
            name: "user",
            type: "USER",
            description: "The user I have to unmute",
            required: true
        }
    ],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
        const memberUnmute: Discord.GuildMember = await interaction.guild.members.fetch(args[0]);

        if (memberUnmute.permissions.has(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
            return interaction.reply("Sorry, but I can't unmute the user you specified, because he has one of the following perms: `ADMINISTATOR` or `MANAGE_MESSAGES`.");
        }

        let muteRole: Discord.Role = interaction.guild.roles.cache.find(role => role.name === "muted");

        if (!muteRole || !memberUnmute.roles.cache.has(muteRole.id)) {
            return interaction.reply(`It looks like that **${memberUnmute.user.tag}** isn't muted :eyes:`);
        } else if (!interaction.member.permissions.has(["ADMINISTRATOR"])) {
            return interaction.reply("You don't have the permission to unmute this person.");
        }

        try {
            memberUnmute.roles.remove(muteRole);
            interaction.reply(`**${memberUnmute.user.tag}** has been successfully unmuted. <:yes:835565213498736650>`);
            LogChecker.insertLog(Client, interaction.guild.id, interaction.member.user, `**${memberUnmute.user.tag}** has been __unmuted__ by ${interaction.member.user.tag}.`);
        } catch (error) {
            interaction.reply("Sorry, but I got an unexcepted error while unmuting this user. " + + `\`\`\`${error.message}\`\`\``);
        }
    }
}