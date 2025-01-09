import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { v4 as uuidv4 } from "uuid";

const RecipeSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4,
		},
		userId: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		tags: {
			type: [String],
			default: [],
		},
		instructions: {
			type: [],
		},
		//possibly change this to its own type later that includes an imageurl
		ingredients: {
			type: [String],
		},
	},
	{ timestamps: true }
);

const Recipe = model("Recipe", RecipeSchema);
export default Recipe;
