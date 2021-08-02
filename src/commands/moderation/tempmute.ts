import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";
import ms from "ms";

// Moderation command

/**
 * Mutes a user
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "tempmute",
    description: "Temporarily mutes a user",
    category: "moderation",
    options: [
        {
            name: "user",
            type: "USER",
            description: "The user I have to mute",
            required: true
        },

        {
            name: "duration",
            type: "STRING",
            description: "The mute duration",
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
        } else if (memberMute.permissions.has(["ADMINISTRATOR"])) {
            return interaction.reply("Sorry, but I can't mute the user you specified, because he has the Administrator permission.");
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

                interaction.guild.channels.cache.forEach(async (channel: Discord.GuildChannel, id) => {
                    await channel.permissionOverwrites.edit(muteRole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });

            } catch (error) {
                interaction.reply("Sorry, but I got an unexcepted error while creating the role. " + `\`\`\`${error.message}\`\`\``);
            }
        }

        let mutetime = args[1];

        if (!mutetime) {
            return interaction.reply("You didn't specify a time to mute the user! :confused:");
        } else if (!ms(mutetime)) {
            return interaction.reply("This isn't a correct duration time. Please retry with a valid one.");
        }

        let reason = args[2] == undefined ? "no reason specified." : (interaction.type === "APPLICATION_COMMAND" ? args[2] : args.slice(1, args.length).join(" "));

        await memberMute.roles.add(muteRole).catch(err => {
            return interaction.reply("Looks like I'm missing permissions. Check them in the server settings.");
        });

        interaction.reply(`**${memberMute.user.tag}** has been muted for *${ms(ms(mutetime))}*. <:yes:835565213498736650>`);

        LogChecker.insertLog(Client, interaction.guild.id, interaction.member.user, `**${memberMute.user.tag}** has been __tempmuted__ by ${interaction.member.user.tag} for: *${reason}* \nDuration of the punishment: ${ms(ms(mutetime))}`);

        setTimeout(async function () {
            memberMute.roles.remove(muteRole);
        }, ms(mutetime));

    }
}
