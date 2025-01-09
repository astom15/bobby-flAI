import mongoose from "mongoose";
import { MessageAttributes } from "./Message";
const { Schema, model } = mongoose;
export interface ChatAttributes {
	id: string;
	userId: string;
	name: string;
	messages: MessageAttributes[];
}
export enum ChatStatus {
	TEMPORARY = "TEMPORARY",
	ACTIVE = "ACTIVE",
}
const ChatSchema = new Schema(
	{
		userId: {
			type: String,
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
		status: {
			type: String,
			enum: ChatStatus,
			default: ChatStatus.TEMPORARY,
		},
	},
	{ timestamps: true }
);

const Chat = model("Chat", ChatSchema);
export default Chat;
