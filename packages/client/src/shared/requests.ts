import type { Dashboard } from "interfaces/dashboard";
import type { Guild } from "interfaces/guild";
import type { Stats } from "interfaces/stats";
import type { User } from "interfaces/user";

async function requestManager(url: string) {
	return await fetch(url, { credentials: "include" }).then((res) => res.json());
}

export async function getUser(): Promise<User> {
	return requestManager(`${import.meta.env.VITE_API_URI}/user`);
}

export async function getGuilds(): Promise<Dashboard> {
	return requestManager(`${import.meta.env.VITE_API_URI}/guilds`);
}

export async function logout(): Promise<void> {
	return requestManager(`${import.meta.env.VITE_API_URI}/logout`);
}

export async function getGuildInfo(id: string): Promise<Guild> {
	return requestManager(`${import.meta.env.VITE_API_URI}/manage/${id}`);
}

export async function getStats(): Promise<Stats> {
	return requestManager(`${import.meta.env.VITE_API_URI}/stats`);
}
