import mongoose from "mongoose";
import { MessageAttributes } from "./Message";
const { Schema, model } = mongoose;
export interface ChatAttributes {
	id: string;
	userId: number;
	name: string;
	messages: MessageAttributes[];
}
const ChatSchema = new Schema(
	{
		userId: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
		},
		message: [
			{
				type: Schema.Types.ObjectId,
				ref: "Message",
			},
		],
	},
	{ timestamps: true }
);

const Chat = model("Chat", ChatSchema);
export default Chat;
