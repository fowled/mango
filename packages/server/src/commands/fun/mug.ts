import Discord from "discord.js";
import canvaslib from "canvas";

// Fun command

/**
 * Sends a mug, with the message author's profile pic
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "mug",
	description: "Replies with a beautiful mug of the tagged user profile picture, or your own!",
	category: "fun",
	botPermissions: ["ATTACH_FILES"],
	options: [
		{
			name: "user",
			type: "USER",
			description: "The user you want to have a mug of",
			required: false,
		},
	],

	async execute(_Client: Discord.Client, interaction: Discord.CommandInteraction, args: string[]) {
		const canvas = canvaslib.createCanvas(300, 250);
		const ctx = canvas.getContext("2d");
		const user = args[0] ? await interaction.guild.members.fetch(args[0]) : interaction.user;

		const background = await canvaslib.loadImage("./assets/images/mug.png");

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.arc(120, 120, 60, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		const avatar = await canvaslib.loadImage(user.displayAvatarURL({ format: "jpg" }));

		ctx.drawImage(avatar, 60, 60, 120, 120);

		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "canvas.png");

		interaction.editReply({ files: [attachment] });
	},
};
