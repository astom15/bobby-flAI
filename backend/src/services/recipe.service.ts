import { IRecipeFormat } from "src/interfaces/IRecipe";
import { IRecipeTrace } from "src/interfaces/IRecipeTrace";
import { logRecipeTrace } from "./recipeTrace.service";

export const validateRecipe = (recipe: unknown): recipe is IRecipeFormat => {
	if (!recipe || typeof recipe !== "object") {
		return false;
	}

	const r = recipe as Record<string, unknown>;

	return !!(
		typeof r.name === "string" &&
		r.name &&
		typeof r.prepTime === "string" &&
		r.prepTime &&
		typeof r.cookTime === "string" &&
		r.cookTime &&
		typeof r.totalTime === "string" &&
		r.totalTime &&
		Array.isArray(r.ingredients) &&
		r.ingredients.every(
			(ing) =>
				typeof ing === "object" &&
				ing &&
				typeof (ing as { name: string; quantity: string }).name === "string" &&
				ing.name &&
				typeof (ing as { name: string; quantity: string }).quantity ===
					"string" &&
				ing.quantity
		) &&
		Array.isArray(r.steps) &&
		r.steps.every((step) => typeof step === "string" && step)
	);
};

export const sanitizeGPTResponse = (content: string): string => {
	return content
		.replace(/'/g, '"')
		.replace(/([{,]\s*)(\w+):/g, '$1"$2":')
		.replace(/:\s*(\d+)([,}])/g, ':"$1"$2');
};

export const processRecipe = async (
	recipe: IRecipeFormat,
	baseTrace: Partial<IRecipeTrace>
): Promise<void> => {
	const postprocessed = JSON.stringify({
		name: recipe.name,
		prepTime: recipe.prepTime,
		cookTime: recipe.cookTime,
		totalTime: recipe.totalTime,
		ingredients: recipe.ingredients,
		steps: recipe.steps,
	});

	const traceData: IRecipeTrace = {
		...baseTrace,
		postprocessed,
		errorTags: [],
		responseType: ["recipe"],
		metadata: {
			...baseTrace.metadata,
			parseSuccess: true,
		},
	} as IRecipeTrace;

	await logRecipeTrace(traceData);
};
