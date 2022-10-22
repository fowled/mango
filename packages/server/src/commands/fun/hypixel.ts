import Discord from 'discord.js';
import { Player } from 'hypixel-api-reborn';

import { hypixelClient } from 'index';

// Fun command

/**
 * Shows information about a Hypixel player.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: 'hypixel',
    description: 'Shows information about a Hypixel player',
    category: 'fun',
    subcommands: [
        {
            name: 'general',
            description: 'Shows information about a Hypixel player',
            type: 1,
            options: [
                {
                    name: 'player',
                    type: 'STRING',
                    description: "The player's username or UUID",
                    required: true,
                },
            ],
        },

        {
            name: 'skywars',
            description: "Shows information about a Hypixel player's skywars stats",
            type: 1,
            options: [
                {
                    name: 'player',
                    type: 'STRING',
                    description: "The player's username or UUID",
                    required: true,
                },
            ],
        },

        {
            name: 'bedwars',
            description: "Shows information about a Hypixel player's bedwars stats",
            type: 1,
            options: [
                {
                    name: 'player',
                    type: 'STRING',
                    description: "The player's username or UUID",
                    required: true,
                },
            ],
        },

        {
            name: 'duels',
            description: "Shows information about a Hypixel player's duels stats",
            type: 1,
            options: [
                {
                    name: 'player',
                    type: 'STRING',
                    description: "The player's username or UUID",
                    required: true,
                },
            ],
        },

        {
            name: 'arcade',
            description: "Shows information about a Hypixel player's arcade stats",
            type: 1,
            options: [
                {
                    name: 'player',
                    type: 'STRING',
                    description: "The player's username or UUID",
                    required: true,
                },
            ],
        },
    ],

    async execute(Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction) {
        let player: Player;

        try {
            player = await hypixelClient.getPlayer(interaction.options.get('player').value as string, { guild: true });
        } catch (err) {
            return interaction.editReply(`<:no:835565213322575963> Couldn't find the player with nickname \`${interaction.options.get('player').value}\`.`);
        }

        switch (interaction.options.getSubcommand()) {
            case 'general':
                general();
                break;

            case 'skywars':
                skywars();
                break;

            case 'bedwars':
                bedwars();
                break;

            case 'duels':
                duels();
                break;

            case 'arcade':
                arcade();
                break;
        }

        function general() {
            const firstLoggedOn = Math.round(new Date(player.firstLoginTimestamp).getTime() / 1000);
            const lastLoggedOn = Math.round(new Date(player.lastLoginTimestamp).getTime() / 1000);

            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL(),
                })
                .setColor('Random')
                .setTitle(player.rank !== 'Default' ? `[${player.rank}] ${player.nickname}` : player.nickname)
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?size=256&default=MHF_Steve&overlay`)
                .setURL(`https://shmeado.club/player/stats/${player.nickname}`)
                .addFields(
                    {
                        name: 'Network level',
                        value: `Level \`${player.level}\``,
                        inline: true,
                    },
                    {
                        name: 'Guild',
                        value: player.guild ? `\`${player.guild.name}\`` : 'not in a guild',
                        inline: true,
                    },
                    {
                        name: 'Status',
                        value: player.isOnline ? 'online' : 'offline',
                        inline: true,
                    },
                    {
                        name: 'First logged on',
                        value: `<t:${firstLoggedOn}:d>`,
                        inline: true,
                    },
                    {
                        name: 'Last logged on',
                        value: player.lastLoginTimestamp ? `<t:${lastLoggedOn}:d>` : 'unknown',
                        inline: true,
                    },
                    { name: 'Karma', value: `\`${player.karma}\``, inline: true },
                    {
                        name: 'Recent game',
                        value: player.recentlyPlayedGame?.name || 'unknown',
                        inline: true,
                    },
                    { name: 'Language', value: player.userLanguage, inline: true },
                    {
                        name: 'Version',
                        value: player.mcVersion || 'unknown',
                        inline: true,
                    },
                )
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.avatarURL(),
                });

            interaction.editReply({ embeds: [embed] });
        }

        function skywars() {
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL(),
                })
                .setColor('Random')
                .setTitle(`Skywars • [${player.stats.skywars.level}⭐] ${player.nickname}`)
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?size=256&default=MHF_Steve&overlay`)
                .setURL(`https://shmeado.club/player/stats/${player.nickname}/skywars/table/`)
                .addFields(
                    {
                        name: 'Skywars wins',
                        value: `\`${player.stats.skywars.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Skywars kills',
                        value: `\`${player.stats.skywars.kills}\``,
                        inline: true,
                    },
                    {
                        name: 'Skywars losses',
                        value: `\`${player.stats.skywars.losses}\``,
                        inline: true,
                    },
                    {
                        name: 'Win/Loss',
                        value: `\`${player.stats.skywars.WLRatio}\``,
                        inline: true,
                    },
                    {
                        name: 'Kill/Death',
                        value: `\`${player.stats.skywars.KDRatio}\``,
                        inline: true,
                    },
                    {
                        name: 'Angel of death',
                        value: `\`${player.stats.skywars.angelOfDeathLevel}\``,
                        inline: true,
                    },
                    {
                        name: 'Skywars Heads',
                        value: `\`${player.stats.skywars.heads}\``,
                        inline: true,
                    },
                    {
                        name: 'Skywars Coins',
                        value: `\`${player.stats.skywars.coins}\``,
                        inline: true,
                    },
                    {
                        name: 'Skywars Tokens',
                        value: `\`${player.stats.skywars.tokens}\``,
                        inline: true,
                    },
                )
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.avatarURL(),
                });

            interaction.editReply({ embeds: [embed] });
        }

        function bedwars() {
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL(),
                })
                .setColor('Random')
                .setTitle(`Bedwars • [${player.stats.bedwars.level}⭐] ${player.nickname}`)
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?size=256&default=MHF_Steve&overlay`)
                .setURL(`https://shmeado.club/player/stats/${player.nickname}/bedwars/table/`)
                .addFields(
                    {
                        name: 'Bedwars wins',
                        value: `\`${player.stats.bedwars.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Bedwars final kills',
                        value: `\`${player.stats.bedwars.finalKills}\``,
                        inline: true,
                    },
                    {
                        name: 'Bedwars losses',
                        value: `\`${player.stats.bedwars.losses}\``,
                        inline: true,
                    },
                    {
                        name: 'Win/Loss',
                        value: `\`${player.stats.bedwars.WLRatio}\``,
                        inline: true,
                    },
                    {
                        name: 'Final kill/Death',
                        value: `\`${player.stats.bedwars.finalKDRatio}\``,
                        inline: true,
                    },
                    {
                        name: 'Beds destroyed',
                        value: `\`${player.stats.bedwars.beds.broken}\``,
                        inline: true,
                    },
                    {
                        name: 'Bedwars coins',
                        value: `\`${player.stats.bedwars.coins}\``,
                        inline: true,
                    },
                    {
                        name: 'Bedwars prestige',
                        value: `\`${player.stats.bedwars.prestige}\``,
                        inline: true,
                    },
                    {
                        name: 'Bedwars winstreak',
                        value: `\`${player.stats.bedwars.winstreak}\``,
                        inline: true,
                    },
                )
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.avatarURL(),
                });

            interaction.editReply({ embeds: [embed] });
        }

        function duels() {
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL(),
                })
                .setColor('Random')
                .setTitle(`Duels • [${player.stats.duels.division}] ${player.nickname}`)
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?size=256&default=MHF_Steve&overlay`)
                .setURL(`https://shmeado.club/player/stats/${player.nickname}/bedwars/table/`)
                .addFields(
                    {
                        name: 'Wins',
                        value: `\`${player.stats.duels.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Losses',
                        value: `\`${player.stats.duels.losses}\``,
                        inline: true,
                    },
                    {
                        name: 'Win/Loss',
                        value: `\`${player.stats.duels.WLRatio}\``,
                        inline: true,
                    },
                    {
                        name: 'UHC wins',
                        value: `\`${player.stats.duels.uhc.overall.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Classic wins',
                        value: `\`${player.stats.duels.classic.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Skywars wins',
                        value: `\`${player.stats.duels.skywars.overall.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Sumo wins',
                        value: `\`${player.stats.duels.sumo.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Bridge wins',
                        value: `\`${player.stats.duels.bridge.overall.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Nodebuff wins',
                        value: `\`${player.stats.duels.nodebuff.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'OP wins',
                        value: `\`${player.stats.duels.op.overall.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Bow wins',
                        value: `\`${player.stats.duels.bow.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Bowspleef wins',
                        value: `\`${player.stats.duels.bowspleef.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Blitz wins',
                        value: `\`${player.stats.duels.blitz.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Mega walls wins',
                        value: `\`${player.stats.duels.blitz.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Combo wins',
                        value: `\`${player.stats.duels.combo.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Parkour wins',
                        value: `\`${player.stats.duels.parkour.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Boxing wins',
                        value: `\`${player.stats.duels.boxing.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Arena kills',
                        value: `\`${player.stats.duels.arena.kills}\``,
                        inline: true,
                    },
                )
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.avatarURL(),
                });

            interaction.editReply({ embeds: [embed] });
        }

        function arcade() {
            const embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.avatarURL(),
                })
                .setColor('Random')
                .setTitle(`Arcade • ${player.nickname}`)
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?size=256&default=MHF_Steve&overlay`)
                .setURL(`https://shmeado.club/player/stats/${player.nickname}/bedwars/table/`)
                .addFields(
                    {
                        name: 'Coins',
                        value: `\`${player.stats.arcade.coins}\``,
                        inline: true,
                    },
                    {
                        name: 'Party games wins',
                        value: `\`${player.stats.arcade.partyGames.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Blocking dead wins',
                        value: `\`${player.stats.arcade.blockingDead.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'CTW captures',
                        value: `\`${player.stats.arcade.captureTheWool.captures}\``,
                        inline: true,
                    },
                    {
                        name: 'Dragon wars wins',
                        value: `\`${player.stats.arcade.dragonWars.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'DTH wins',
                        value: `\`${player.stats.arcade.drawTheirThing.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Easter sim. wins',
                        value: `\`${player.stats.arcade.easterSimulator.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Ender spleef wins',
                        value: `\`${player.stats.arcade.enderSpleef.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Farm hunt wins',
                        value: `\`${player.stats.arcade.farmHunt.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Galaxy wars wins',
                        value: `\`${player.stats.arcade.galaxyWars.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Grinch sim. wins',
                        value: `\`${player.stats.arcade.grinchSimulator.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Hole in the wall wins',
                        value: `\`${player.stats.arcade.holeInTheWall.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Hypixel sports wins',
                        value: `\`${player.stats.arcade.hypixelSports.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Mini walls wins',
                        value: `\`${player.stats.arcade.miniWalls.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'OITQ wins',
                        value: `\`${player.stats.arcade.oitq.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Santa says wins',
                        value: `\`${player.stats.arcade.santaSays.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Santa sim. wins',
                        value: `\`${player.stats.arcade.santaSimulator.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Scuba sim. wins',
                        value: `\`${player.stats.arcade.scubaSimulator.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Simon says wins',
                        value: `\`${player.stats.arcade.simonSays.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Soccer wins',
                        value: `\`${player.stats.arcade.soccer.wins}\``,
                        inline: true,
                    },
                    {
                        name: 'Throw out wins',
                        value: `\`${player.stats.arcade.throwOut.wins}\``,
                        inline: true,
                    },
                )
                .setFooter({
                    text: Client.user.username,
                    iconURL: Client.user.avatarURL(),
                });

            interaction.editReply({ embeds: [embed] });
        }
    },
};
