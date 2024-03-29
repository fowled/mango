export interface Guild {
    message?: string;
    id: string;
    name: string;
    icon: string;
    features: [];
    commands: [];
    members: [];
    channels: [];
    bans: [];
    roles: [];
    stageInstances: [];
    invites: [];
    deleted: boolean;
    shardId: number;
    splash: string;
    banner: string;
    description: string;
    verificationLevel: string;
    vanityURLCode: string;
    nsfwLevel: string;
    discoverySplash: string;
    memberCount: number;
    large: boolean;
    applicationId: string;
    afkTimeout: number;
    afkChannelId: string;
    systemChannelId: string;
    premiumTier: string;
    premiumSubscriptionCount: number;
    explicitContentFilter: string;
    mfaLevel: string;
    joinedTimestamp: number;
    defaultMessageNotifications: string;
    systemChannelFlags: number;
    maximumMembers: number;
    maximumPresences: number;
    approximateMemberCount: number;
    approximatePresenceCount: number;
    vanityURLUses: number;
    rulesChannelId: string;
    publicUpdatesChannelId: string;
    preferredLocale: string;
    ownerId: string;
    emojis: [];
    stickers: [];
    createdTimestamp: number;
    nameAcronym: string;
    iconURL: string;
    splashURL: string;
    discoverySplashURL: string;
    bannerURL: string;
    bot?: boolean;
    welcome?: string;
    birthdays?: string;
}

export interface PartialGuild {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[];
}

export interface User {
    message?: string;
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    banner: string;
    banner_color: string;
    accent_color: number;
    locale: string;
    mfa_enabled: boolean;
    premium_type: number;
}
