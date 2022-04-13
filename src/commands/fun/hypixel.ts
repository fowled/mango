import Discord from "discord.js";
import { Player } from "hypixel-api-reborn";

import { hypixelClient } from "../../index";

// Fun command

/**
 * Shows information about a Hypixel player.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "hypixel",
	description: "Shows information about a Hypixel player",
	category: "fun",
	subcommands: [
		{
			name: "general",
			description: "Shows information about a Hypixel player",
			type: 1,
			options: [
				{
					name: "player",
					type: "STRING",
					description: "The player's username or UUID",
					required: true,
				},
			],
		},

		{
			name: "skywars",
			description: "Shows information about a Hypixel player's skywars stats",
			type: 1,
			options: [
				{
					name: "player",
					type: "STRING",
					description: "The player's username or UUID",
					required: true,
				},
			],
		},

		{
			name: "bedwars",
			description: "Shows information about a Hypixel player's bedwars stats",
			type: 1,
			options: [
				{
					name: "player",
					type: "STRING",
					description: "The player's username or UUID",
					required: true,
				},
			],
		},

		{
			name: "duels",
			description: "Shows information about a Hypixel player's duels stats",
			type: 1,
			options: [
				{
					name: "player",
					type: "STRING",
					description: "The player's username or UUID",
					required: true,
				},
			],
		},

		{
			name: "arcade",
			description: "Shows information about a Hypixel player's arcade stats",
			type: 1,
			options: [
				{
					name: "player",
					type: "STRING",
					description: "The player's username or UUID",
					required: true,
				},
			],
		},
	],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message) {
		let player: Player;

		try {
			player = await hypixelClient.getPlayer(interaction.options.get("player").value as string, { guild: true });
		} catch (err) {
			return interaction.editReply(`<:no:835565213322575963> Couldn't find the player with nickname \`${interaction.options.get("player").value}\`.`);
		}

		switch (interaction.options.getSubcommand()) {
			case "general":
				general();
				break;

			case "skywars":
				skywars();
				break;

			case "bedwars":
				bedwars();
				break;

			case "duels":
				duels();
				break;

			case "arcade":
				arcade();
				break;
		}

		function general() {
			const firstLoggedOn = Math.round(new Date(player.firstLoginTimestamp).getTime() / 1000);
			const lastLoggedOn = Math.round(new Date(player.lastLoginTimestamp).getTime() / 1000);

			const embed = new Discord.MessageEmbed()
				.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
				.setColor("RANDOM")
				.setTitle(player.rank !== "Default" ? `[${player.rank}] ${player.nickname}` : player.nickname)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?size=256&default=MHF_Steve&overlay`)
				.setURL(`https://shmeado.club/player/stats/${player.nickname}`)
				.addField("Network level", `Level \`${player.level}\``, true)
				.addField("Guild", player.guild ? `\`${player.guild.name}\`` : "not in a guild", true)
				.addField("Status", player.isOnline ? "online" : "offline", true)
				.addField("First logged on", `<t:${firstLoggedOn}:d>`, true)
				.addField("Last logged on", player.lastLoginTimestamp ? `<t:${lastLoggedOn}:d>` : "unknown", true)
				.addField("Karma", `\`${player.karma}\``, true)
				.addField("Recent game", player.recentlyPlayedGame?.name || "unknown", true)
				.addField("Language", player.userLanguage, true)
				.addField("Version", player.mcVersion || "unknown", true)
				.setFooter(Client.user.username, Client.user.avatarURL());

			interaction.editReply({ embeds: [embed] });
		}

		function skywars() {
			const embed = new Discord.MessageEmbed()
				.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
				.setColor("RANDOM")
				.setTitle(`Skywars • [${player.stats.skywars.level}⭐] ${player.nickname}`)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?size=256&default=MHF_Steve&overlay`)
				.setURL(`https://shmeado.club/player/stats/${player.nickname}/skywars/table/`)
				.addField("Skywars wins", `\`${player.stats.skywars.wins}\``, true)
				.addField("Skywars kills", `\`${player.stats.skywars.kills}\``, true)
				.addField("Skywars losses", `\`${player.stats.skywars.losses}\``, true)
				.addField("Win/Loss", `\`${player.stats.skywars.WLRatio}\``, true)
				.addField("Kill/Death", `\`${player.stats.skywars.KDRatio}\``, true)
				.addField("Angel Of Death", `\`${player.stats.skywars.angelOfDeathLevel}\``, true)
				.addField("Skywars Heads", `\`${player.stats.skywars.heads}\``, true)
				.addField("Skywars Coins", `\`${player.stats.skywars.coins}\``, true)
				.addField("Skywars Tokens", `\`${player.stats.skywars.tokens}\``, true)
				.setFooter(Client.user.username, Client.user.avatarURL());

			interaction.editReply({ embeds: [embed] });
		}

		function bedwars() {
			const embed = new Discord.MessageEmbed()
				.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
				.setColor("RANDOM")
				.setTitle(`Bedwars • [${player.stats.bedwars.level}⭐] ${player.nickname}`)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?size=256&default=MHF_Steve&overlay`)
				.setURL(`https://shmeado.club/player/stats/${player.nickname}/bedwars/table/`)
				.addField("Bedwars wins", `\`${player.stats.bedwars.wins}\``, true)
				.addField("Bedwars final kills", `\`${player.stats.bedwars.finalKills}\``, true)
				.addField("Bedwars losses", `\`${player.stats.bedwars.losses}\``, true)
				.addField("Win/Loss", `\`${player.stats.bedwars.WLRatio}\``, true)
				.addField("Final kill/Death", `\`${player.stats.bedwars.finalKDRatio}\``, true)
				.addField("Beds destroyed", `\`${player.stats.bedwars.beds.broken}\``, true)
				.addField("Bedwars coins", `\`${player.stats.bedwars.coins}\``, true)
				.addField("Bedwars prestige", `\`${player.stats.bedwars.prestige}\``, true)
				.addField("Bedwars winstreak", `\`${player.stats.bedwars.winstreak}\``, true)
				.setFooter(Client.user.username, Client.user.avatarURL());

			interaction.editReply({ embeds: [embed] });
		}

		function duels() {
			const embed = new Discord.MessageEmbed()
				.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
				.setColor("RANDOM")
				.setTitle(`Duels • [${player.stats.duels.division}] ${player.nickname}`)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?size=256&default=MHF_Steve&overlay`)
				.setURL(`https://shmeado.club/player/stats/${player.nickname}/bedwars/table/`)
				.addField("Wins", `\`${player.stats.duels.wins}\``, true)
				.addField("Losses", `\`${player.stats.duels.losses}\``, true)
				.addField("Win/Loss", `\`${player.stats.duels.WLRatio}\``, true)
				.addField("UHC wins", `\`${player.stats.duels.uhc.overall.wins}\``, true)
				.addField("Classic wins", `\`${player.stats.duels.classic.wins}\``, true)
				.addField("Skywars wins", `\`${player.stats.duels.skywars.overall.wins}\``, true)
				.addField("Sumo wins", `\`${player.stats.duels.sumo.wins}\``, true)
				.addField("Bridge wins", `\`${player.stats.duels.bridge.overall.wins}\``, true)
				.addField("Nodebuff wins", `\`${player.stats.duels.nodebuff.wins}\``, true)
				.addField("OP wins", `\`${player.stats.duels.op.overall.wins}\``, true)
				.addField("Bow wins", `\`${player.stats.duels.bow.wins}\``, true)
				.addField("Bowspleef wins", `\`${player.stats.duels.bowspleef.wins}\``, true)
				.addField("Blitz wins", `\`${player.stats.duels.blitz.wins}\``, true)
				.addField("Mega walls wins", `\`${player.stats.duels.megawalls.wins}\``, true)
				.addField("Combo wins", `\`${player.stats.duels.combo.wins}\``, true)
				.addField("Parkour wins", `\`${player.stats.duels.parkour.wins}\``, true)
				.addField("Boxing wins", `\`${player.stats.duels.boxing.wins}\``, true)
				.addField("Arena kills", `\`${player.stats.duels.arena.kills}\``, true)
				.setFooter(Client.user.username, Client.user.avatarURL());

			interaction.editReply({ embeds: [embed] });
		}

		function arcade() {
			const embed = new Discord.MessageEmbed()
				.setAuthor(interaction.member.user.username, interaction.member.user.avatarURL())
				.setColor("RANDOM")
				.setTitle(`Arcade • ${player.nickname}`)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?size=256&default=MHF_Steve&overlay`)
				.setURL(`https://shmeado.club/player/stats/${player.nickname}/bedwars/table/`)
				.addField("Coins", `\`${player.stats.arcade.coins}\``, true)
				.addField("Party games wins", `\`${player.stats.arcade.partyGames.wins}\``, true)
				.addField("Blocking dead wins", `\`${player.stats.arcade.blockingDead.wins}\``, true)
				.addField("CTW captures", `\`${player.stats.arcade.captureTheWool.captures}\``, true)
				.addField("Dragon wars wins", `\`${player.stats.arcade.dragonWars.wins}\``, true)
				.addField("DTH wins", `\`${player.stats.arcade.drawTheirThing.wins}\``, true)
				.addField("Easter sim. wins", `\`${player.stats.arcade.easterSimulator.wins}\``, true)
				.addField("Ender spleef wins", `\`${player.stats.arcade.enderSpleef.wins}\``, true)
				.addField("Farm hunt wins", `\`${player.stats.arcade.farmHunt.wins}\``, true)
				.addField("Galaxy wars wins", `\`${player.stats.arcade.galaxyWars.wins}\``, true)
				.addField("Grinch sim. wins", `\`${player.stats.arcade.grinchSimulator.wins}\``, true)
				.addField("Hole in the wall wins", `\`${player.stats.arcade.holeInTheWall.wins}\``, true)
				.addField("Hypixel sports wins", `\`${player.stats.arcade.hypixelSports.wins}\``, true)
				.addField("Mini walls wins", `\`${player.stats.arcade.miniWalls.wins}\``, true)
				.addField("OITQ wins", `\`${player.stats.arcade.oitq.wins}\``, true)
				.addField("Santa says wins", `\`${player.stats.arcade.santaSays.wins}\``, true)
				.addField("Santa sim. wins", `\`${player.stats.arcade.santaSimulator.wins}\``, true)
				.addField("Scuba sim. wins", `\`${player.stats.arcade.scubaSimulator.wins}\``, true)
				.addField("Simon says wins", `\`${player.stats.arcade.simonSays.wins}\``, true)
				.addField("Soccer wins", `\`${player.stats.arcade.soccer.wins}\``, true)
				.addField("Throw out wins", `\`${player.stats.arcade.throwOut.wins}\``, true)
				// .addField("Zombies wins", `\`${player.stats.arcade.zombies.overall.wins}\``, true)
				.setFooter(Client.user.username, Client.user.avatarURL());

			interaction.editReply({ embeds: [embed] });
		}
	},
};
