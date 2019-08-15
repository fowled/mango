export interface ScratchError {
	code: string;
	message: string;
}

export interface ScratchProject {
	id: number;
	title: string;
	description: string;
	instructions: string;
	visibility: string;
	public: boolean;
	comments_allowed: boolean;
	is_published: boolean;
	author: ScratchProjectAuthor;
	image: string;
	images: { [key: string]: string };
	history: ScratchProjectHistory;
	stats: ScratchProjectStats;
}

export interface ScratchProjectAuthor {
	id: number;
	username: string;
	scratchteam: boolean;
	history: ScratchUserHistory;
	profile: ScratchUserProfile;
}

export interface ScratchUserHistory {
	joined: string;
}

export interface ScratchUserProfile {
	id: number | null;
	images: { [key: string]: string };
}

export interface ScratchProjectHistory {
	created: string;
	modified: string;
	shared: string;
}

export interface ScratchprojectRemix {
	parent: number | null;
	root: number | null;
}

export interface ScratchProjectStats {
	views: number;
	loves: number;
	favorites: number;
	comments: number;
	remixes: number;
}
