import { Client, CommandInteraction } from "discord.js";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "interfaces/DB";

export interface Command {
    name: string;
    description: string;
    category: string;
    options?: [{ name: string; type: string; description: string; required: boolean }];
    subcommands?: [
        {
            name: string;
            description: string;
            type: number;
            options?: [{ name: string; type: string; description: string; required: boolean }];
        },
    ];
    botPermissions?: string[];
    memberPermissions?: string[];
    execute(Client: Client, interaction: CommandInteraction, args: string[], db: SupabaseClient<Database, "public">): Promise<void>;
}
