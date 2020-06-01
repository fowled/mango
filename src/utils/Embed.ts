import * as Discord from "discord.js";

export function create(Client: Discord.Client, {
		color = Math.floor(Math.random() * (0xffffff + 1)),
		description = `${Client.user.username} - A multitask and multilingual bot`,
		fields = [],
		footer = { text: `${Client.user.username} - A multitask and multilingual bot`, iconURL: Client.user.avatar},
		thumbnail,
		timestamp = Date.now(),
		title = Client.user.username,
		url,
	}: {
		color?: Discord.ColorResolvable,
		description?: string,
		fields?: Array<{ name: string, value: string, inline?: boolean}>,
		footer?: { text?: string, iconURL?: string, proxyIconURL?: string },
		thumbnail?: { url: string, proxyURL?: string, height?: number, width?: number},
		timestamp?: number,
		title: string,
		url?: string,
	}): Discord.MessageEmbed {
		return new Discord.MessageEmbed({
			author: {
				name: Client.user.username,
				iconURL: Client.user.avatar,
				icon_url: Client.user.avatar,
			},
			color: color instanceof Array ? color[0] : color,
			description: description ? description : undefined,
			fields,
			title: title || Client.user.username,
			thumbnail: thumbnail || {
				url: Client.user.avatar,
			},
			footer: footer || {
				text: `${Client.user.username} - A multitask and multilingual bot`,
				iconURL: Client.user.avatar,
			},
		});
}
