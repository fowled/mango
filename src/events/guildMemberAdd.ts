import * as Discord from "discord.js";
import * as Sequelize from "sequelize";
import { sequelizeinit } from "../index";
import * as canvaslib from "canvas";
import * as Logger from "../utils/Logger";

export default async (Client: Discord.Client, member: Discord.GuildMember) => {
    const welcomechannelmodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = sequelizeinit.model("welChannels");
    const welcomechannel = await welcomechannelmodel.findOne({ where: { idOfGuild: member.guild.id } });

    if (!welcomechannel) return;

    const channel = Client.channels.cache.get(welcomechannel.get("idOfChannel") as unknown as string);

    const canvas = canvaslib.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const background = await canvaslib.loadImage("./assets/images/background.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = "35px Caviar Dreams"; // displays on the picture the member tag
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "center";
    ctx.fillText(`Welcome \n${member.user.tag}`, canvas.width - 400, canvas.height / 2.3);

    ctx.font = "25px Caviar Dreams"; // displays on the picture the member tag
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "center";
    ctx.fillText(`Member #${member.guild.members.cache.size}`, canvas.width - 200, canvas.height / 1.30);

    ctx.beginPath(); // rounded profile pic
    ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await canvaslib.loadImage(member.user.displayAvatarURL({ format: "jpg" }));
    ctx.drawImage(avatar, 25, 25, 100, 100);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    try {
        // @ts-ignore
        channel.send(`Welcome ${member} to **${member.guild.name}**!`, attachment);
    } catch (err) {
        Logger.error("Didn't find the channel to post attachment [guildMemberAdd]");
    }
};
