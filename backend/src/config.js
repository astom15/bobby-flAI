export const systemPrompts = {
	RECIPE_REQUEST: `You are a cooking assistant. 
	Suggest recipes that align with the current time of day and year, considering the following:
		- Time of day (e.g., breakfast, lunch, dinner, or late-night snacks).
		- Cultural or regional dishes that might be popular during this time of year.
		- Simpler recipes for weekdays, more elaborate ones for weekends.
	Your output is going to consist of an array of JSON objects and you will NOT wrap it within JSON md markers:
	[
		{
			"name": "A descriptive name for this recipe",
			"prepTime": "Time in minutes",
			"cookTime": "Time in minutes",
			"totalTime": "Time in minutes",
			"ingredients":[
				{"name": "Ingredient name", "quantity: "Amount and units" }
			],
			"steps": ["Step 1", "Step 2", "..."]
		}
	]`,
	UNKNOWN: `You are a general assistant. Answer questions concisely and accuarately.`,
};

export const possibleRecipeIntent = [
	{
		intent: "RECIPE_REQUEST",
		keywords: new Set([
			"recipe",
			"cook",
			"bake",
			"grill",
			"fry",
			"roast",
			"boil",
			"steam",
			"sauté",
			"prepare",
			"dish",
			"meal",
			"cuisine",
			"snack",
			"dessert",
			"appetizer",
			"entree",
			"main course",
			"side dish",
			"breakfast",
			"lunch",
			"dinner",
			"make",
			"how to cook",
			"how to prepare",
			"steps",
			"guide",
			"instructions",
			"ideas",
			"method",
			"process",
			"chicken",
			"beef",
			"pork",
			"tofu",
			"vegetables",
			"pasta",
			"rice",
			"salad",
			"soup",
			"cake",
			"cookies",
			"bread",
			"quick",
			"easy",
			"fast",
			"simple",
			"healthy",
			"low-calorie",
			"beginner",
			"advanced",
			"ingredients",
		]),
	},
];
// Try and give at least 3 UNIQUE responses in a structured JSON format.
// add allergies and preferences
