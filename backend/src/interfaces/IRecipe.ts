export interface IRecipeFormat {
	name: string;
	prepTime: string;
	cookTime: string;
	totalTime: string;
	ingredients: { name: string; quantity: string }[];
	steps: string[];
}
