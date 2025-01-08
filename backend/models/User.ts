export interface UserAttributes {
	id: number;
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
