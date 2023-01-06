import Discord from "discord.js";
import canvaslib from "canvas";

import { supabase } from "index";

import { warn } from "utils/logger";

module.exports = {
    name: "guildMemberRemove",
    async execute(Client: Discord.Client, member: Discord.GuildMember) {
        const fetchUserFromDB = await supabase.from("users").select("guilds").like("user_id", member.id).single();

        if (fetchUserFromDB.data) {
            const filterGuild = fetchUserFromDB.data.guilds.filter(g => g !== member.guild.id);

            await supabase.from("users").update({ guilds: filterGuild }).like("user_id", member.user.id);
        }

        const welcomechannel = await supabase.from("guilds").select().like("guild_id", member.guild.id).single();

        if (!welcomechannel.data.welcome) return;

        const channel = (await Client.channels.fetch(welcomechannel.data.welcome)) as Discord.TextChannel;
        const fetchNumberOfMembers = member.guild.memberCount;

        const canvas = canvaslib.createCanvas(700, 250);
        const ctx = canvas.getContext("2d");

        const background = await canvaslib.loadImage("./assets/images/leave_background.png");

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.font = "35px Caviar Dreams";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left";
        ctx.fillText(`A user left the server. \nWe're now ${fetchNumberOfMembers} members.`, 10, canvas.height / 2.5);

        ctx.font = "27px Caviar Dreams";
        ctx.fillText(`${member.user.tag}`, 10, canvas.height / 1.15);

        ctx.beginPath();
        ctx.arc(630, 75, 60, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await canvaslib.loadImage(member.user.displayAvatarURL({ extension: "jpg" }));

        ctx.drawImage(avatar, 570, 15, 120, 120);

        const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), {
            name: "welcome.png",
        });

        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: member.user.tag,
                iconURL: member.user.displayAvatarURL(),
            })
            .setDescription(`:frowning: See you soon ${member}`)
            .setImage("attachment://welcome.png")
            .setColor("#808080");

        try {
            await channel.send({ embeds: [embed], files: [attachment] });
        } catch (err) {
            warn("Didn't find the channel to post attachment [guildMemberRemove]");
        }
    },
};
