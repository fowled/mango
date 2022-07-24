import type { Guild } from "./guild";

export interface Dashboard {
	authed: boolean;
	guilds: Guild[];
}
