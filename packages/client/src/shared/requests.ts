import type { Guild, User } from "types/interfaces";

async function requestManager(url: string) {
	return await fetch(url, { credentials: "include" }).then((res) => res.json());
}

export async function getUser(): Promise<User> {
	return requestManager(`${import.meta.env.VITE_API_URI}/user`);
}

export async function getGuilds(): Promise<Guild[]> {
	return requestManager(`${import.meta.env.VITE_API_URI}/guilds`);
}

export async function logout(): Promise<void> {
	return requestManager(`${import.meta.env.VITE_API_URI}/logout`);
}

export async function getGuildInfo(id: string): Promise<Guild> {
	return requestManager(`${import.meta.env.VITE_API_URI}/manage/${id}`);
}

export async function getStats(): Promise<{ users: number; servers: number }> {
	return requestManager(`${import.meta.env.VITE_API_URI}/stats`);
}