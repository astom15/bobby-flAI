export interface IUser {
	id: string;
	name: string;
	email: string;
	imageUrl: string | null;
	allergies: string[];
	preferences: string[];
	countryCode: string;
	region: string | null;
	// favorites: Recipe[];
	// chats: Chat[];
}

export interface EditUserInput {
	name?: string;
	email?: string;
	imageUrl?: string;
	allergies?: string[];
	preferences?: string[];
	countryCode?: string;
	region?: string;
}

export interface ItemRemoval {
	allergies?: string[];
	preferences?: string[];
}
