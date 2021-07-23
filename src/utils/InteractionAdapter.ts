import * as Discord from "discord.js";

export async function replyMsg(message: Discord.Message & Discord.CommandInteraction, content: any, msg: Discord.Message, editReply: boolean) {
    if (editReply && message.type === "APPLICATION_COMMAND") {
        return message.editReply(content);
    } else {
        return msg.edit(content);
    }
}
