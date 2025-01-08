import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { v4 as uuidv4 } from "uuid";

const FavoriteSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4,
		},
		recipeId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Favorite = model("Favorite", FavoriteSchema);
export default Favorite;
