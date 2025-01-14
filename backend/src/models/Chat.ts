import mongoose from "mongoose";
import { IMessage } from "./Message";
import { v4 as uuidv4 } from "uuid";
const { Schema, model } = mongoose;
export interface IChat {
	id: string;
	userId: string;
	name: string;
	messages: IMessage[];
	createdAt: Date;
	updatedAt: Date;
}
export enum ChatStatus {
	TEMPORARY = "TEMPORARY",
	ACTIVE = "ACTIVE",
}
const ChatSchema = new Schema(
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
		},
		status: {
			type: String,
			enum: ChatStatus,
			default: ChatStatus.TEMPORARY,
		},
	},
	{ timestamps: true }
);

ChatSchema.virtual("id").get(function () {
	return this._id.toString();
});
ChatSchema.virtual("messages", {
	ref: "Message",
	localField: "_id",
	foreignField: "chatId",
});
ChatSchema.set("toObject", {
	virtuals: true,
	transform: (doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});
ChatSchema.set("toJSON", {
	virtuals: true,
	transform: (doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

const Chat = model("Chat", ChatSchema);
export default Chat;
