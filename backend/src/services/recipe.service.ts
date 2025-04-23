import { IRecipeFormat } from "src/interfaces/IRecipe";
import { IRecipeTrace } from "src/interfaces/IRecipeTrace";
import { logRecipeTrace } from "./recipeTrace.service";
import Errors from "src/errors/errorFactory";

export const validateRecipe = (recipe: unknown): recipe is IRecipeFormat => {
	if (!recipe || typeof recipe !== "object" || recipe == null) {
		return false;
	}

	const r = recipe as Record<string, unknown>;
	if (
		typeof r.name !== "string" ||
		!r.name ||
		typeof r.prepTime !== "string" ||
		!r.prepTime ||
		typeof r.cookTime !== "string" ||
		!r.cookTime ||
		typeof r.totalTime !== "string" ||
		!r.totalTime ||
		!Array.isArray(r.ingredients) ||
		!Array.isArray(r.steps)
	) {
		return false;
	}
	for (const ing of r.ingredients) {
		if (
			typeof ing !== "object" ||
			ing === null ||
			typeof ing.name !== "string" ||
			!ing.name ||
			typeof ing.quantity !== "string" ||
			!ing.quantity
		) {
			return false;
		}
	}

	for (const step of r.steps) {
		if (typeof step !== "string" || !step) {
			return false;
		}
	}

	return true;
};

export const sanitizeGPTResponse = (content: string): string => {
	try {
		const repairedContent = content
			.trim()
			.replace(/\\n/g, "\\n") // Handle escaped newlines
			.replace(/\\t/g, "\\t") // Handle escaped tabs
			.replace(/,\s*\]/g, "]") // Remove trailing commas in arrays
			.replace(/,\s*\}/g, "}") // Remove trailing commas in objects
			.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":') // Ensure keys are quoted
			.replace(/:(\s*)'([^']*)'/g, ': "$2"') // Replace single quotes with double quotes for values
			.replace(/:(\s*)"([^"]*),([^"]*)"/g, ': "$2,$3"') // Handle commas in values
			.replace(/:(\s*)"([^"]*)\\n([^"]*)"/g, ': "$2\\n$3"') // Handle newlines in values
			.replace(/:(\s*)"([^"]*)\\t([^"]*)"/g, ': "$2\\t$3"'); // Handle tabs in values
		JSON.parse(repairedContent);

		return repairedContent;
	} catch (repairErr) {
		throw Errors.JSONRepair.repairFailed(repairErr);
	}
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
