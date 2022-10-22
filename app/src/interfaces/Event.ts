import { Client } from "discord.js";

export interface Event {
    name: string;
    once?: boolean;
    execute(client: Client, ...args: string[]): Promise<void>;
}
