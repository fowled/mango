import Discord from "discord.js";
import si from "systeminformation";
import moment from "moment";

// Infobot command

/**
 * Replies with some info about the bot host
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */

module.exports = {
    name: "infobot",
    description: "Get info about Mango's infrastructure",
    category: "info",

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction) {
        const discordVersion = (await import("discord.js")).version;
        let ramInfo: si.Systeminformation.MemData, os: si.Systeminformation.OsData;

        await si.mem().then((data) => (ramInfo = data));
        await si.osInfo().then((data) => (os = data));

        const info = new Discord.EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription("About **Mango's infrastructure**")
            .addFields(
                { name: "Node version", value: process.version },
                { name: "Discord.js version", value: discordVersion },
                { name: "OS", value: os.distro },
                {
                    name: "Memory",
                    value: `${(ramInfo.total / 104853.2055).toFixed()} mb`,
                },
                { name: "Uptime", value: moment.duration(Client.uptime).humanize() },
                {
                    name: "Stats",
                    value: `» \`${await collectUsers()}\` users \n» \`${Client.guilds.cache.size}\` guilds`,
                },
            )
            .setColor("Random")
            .setTimestamp()
            .setFooter({
                text: Client.user.username,
                iconURL: Client.user.displayAvatarURL(),
            });
        interaction.editReply({ embeds: [info] });

        async function collectUsers() {
            let usersCount = 0;

            await Client.guilds.cache.map((guild) => {
                if (guild.memberCount === undefined) return;

                return (usersCount += guild.memberCount);
            });

            return usersCount;
        }
    },
};
