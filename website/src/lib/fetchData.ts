import { session } from "./sessionManager";
import { supabase } from "./supabase";

import type { Guild, PartialGuild } from "types/interfaces";

export async function getUserData() {
    return (
        await supabase.from("users").select().like("user_id", session.value?.user.user_metadata.provider_id).single()
    ).data;
}

export async function getMutualGuilds() {
    return (await supabase.rpc("get_mutual_guilds", { userid: session.value?.user.user_metadata.provider_id })).data;
}

async function getUserGuilds(): Promise<PartialGuild[]> {
    return await fetch("https://discord.com/api/v10/users/@me/guilds", {
        headers: new Headers({ Authorization: `Bearer ${session.value?.provider_token}` }),
    }).then((res) => res.json());
}

export async function filterGuilds(): Promise<PartialGuild[]> {
    const [discordGuilds, mutualGuildsIds] = await Promise.all([await getUserGuilds(), await getMutualGuilds()]);

    const guilds = discordGuilds.filter(
        (g) => mutualGuildsIds?.map((guild) => guild.guild_id).includes(g.id) && (parseInt(g.permissions) & 32) === 32
    );

    return guilds;
}

export async function fetchGuild(id: string): Promise<Guild> {
    return await fetch(`${import.meta.env.VITE_API_URI}/guild/${id}`).then((res) => res.json());
}

export async function fetchStats(): Promise<{ guilds: number, users: number }> {
    return await fetch(`${import.meta.env.VITE_API_URI}/stats`).then((res) => res.json());
}
