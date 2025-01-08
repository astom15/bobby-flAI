import mongoose from "mongoose";
const { Schema, model } = mongoose;
export interface MessageAttributes {
	id: string;
	chatId: string;
	sender: string;
	content: string;
	imageUrl?: string;
	timestamp: string;
}
const MessageSchema = new Schema(
	{
		chatId: {
			type: Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
		sender: {
			type: Number,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Message = model("Message", MessageSchema);
export default Message;
