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
    name: "mute",
    description: "Mutes a user",
    category: "moderation",
    options: [
        {
            name: "user",
            type: "USER",
            description: "The user I have to mute",
            required: true
        },

        {
            name: "reason",
            type: "STRING",
            description: "The reason of the mute",
            required: false
        }
    ],

    async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, args: string[], ops) {
        const memberMute: Discord.GuildMember = await interaction.guild.members.fetch(args[0]);

        if (!memberMute) {
            return interaction.reply("You specified an invalid user to mute. Please tag him in order to mute them.");
        } if (memberMute.permissions.has(["ADMINISTRATOR"])) {
            return interaction.reply("Sorry, but I can't mute the user you specified, because he has one of the following perms: `ADMINISTRATOR`");
        } else if (!interaction.member.permissions.has(["MANAGE_MESSAGES"])) {
            return interaction.reply("Sorry, but you don't have the permission to mute this user.");
        }

        let muteRole: Discord.Role = interaction.guild.roles.cache.find(role => role.name === "muted");

        if (!muteRole) {
            try {
                muteRole = await interaction.guild.roles.create({
                    name: "muted",
                    mentionable: false,
                    permissions: [],
                    color: "#524F4F"
                });

            } catch (error) {
                interaction.reply("Sorry, but I got an unexcepted error while creating the role. " + + `\`\`\`${error.message}\`\`\``);
            }
        }

        interaction.guild.channels.cache.forEach(async (channel: Discord.GuildChannel, id) => {
            await channel.permissionOverwrites.edit(muteRole, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            });
        });

        await memberMute.roles.add(muteRole);

        let reason = args[1] == undefined ? "no reason specified." : args[1];

        interaction.reply(`**${memberMute.user.tag}** has been muted for: *${reason}*. <:yes:835565213498736650>`);

        LogChecker.insertLog(Client, interaction.guild.id, interaction.member.user, `**${memberMute.user.tag}** has been __muted__ by ${interaction.member.user.tag} for: *${reason}* \nDuration of the punishment: infinite`);
    }
}
