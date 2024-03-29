import Discord from "discord.js";
import canvaslib from "canvas";

// Fun command

/**
 * Draws something.
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "canvas",
    description: "Write something on beautiful picture",
    category: "fun",
    botPermissions: ["AttachFiles"],
    options: [
        {
            name: "text",
            type: 3,
            description: "The message you want to display on the picture",
            required: true,
        },
    ],

    async execute(_Client: Discord.Client, interaction: Discord.ChatInputCommandInteraction, args: string[]) {
        if (args[0].length > 45) {
            return interaction.editReply("Your text is too long! Please retry the command.");
        }

        const canvas = canvaslib.createCanvas(700, 250);
        const ctx = canvas.getContext("2d");

        const background = await canvaslib.loadImage("./assets/images/background.png");

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.font = "35px Caviar Dreams";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(`"${args.join(" ")}"`, 10, canvas.height / 1.5);

        ctx.font = "35px Caviar Dreams";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(`${interaction.user.username} said:`, 10, canvas.height / 2);

        ctx.beginPath();
        ctx.arc(630, 75, 60, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await canvaslib.loadImage(interaction.user.displayAvatarURL({ extension: "jpg" }));

        ctx.drawImage(avatar, 570, 15, 120, 120);

        const attachment = new Discord.AttachmentBuilder(canvas.toBuffer());

        interaction.editReply({ files: [attachment] });
    },
};
