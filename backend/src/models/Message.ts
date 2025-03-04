import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const { Schema, model } = mongoose;
export interface IMessage {
	id: string;
	chatId: string;
	sender: Sender;
	content: string;
	imageUrl?: string | null;
	createdAt: Date;
	updatedAt: Date;
}
export interface IMessageInput {
	chatId: string;
	sender: Sender;
	content: string;
	imageUrl?: string | null;
}
export interface IEditMessageInput {
	id: string;
	content: string;
	imageUrl?: string | null;
}
export enum Sender {
	BOT = "BOT",
	USER = "USER",
}
const MessageSchema = new Schema(
	{
		_id: {
			type: String,
			default: uuidv4,
		},
		chatId: {
			type: String,
			ref: "Chat",
			required: true,
			index: true,
		},
		sender: {
			type: String,
			enum: Object.values(Sender),
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

MessageSchema.virtual("id").get(function () {
	return this._id.toString();
});

MessageSchema.set("toObject", {
	virtuals: true,
	transform: (doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});
MessageSchema.set("toJSON", {
	virtuals: true,
	transform: (doc, ret) => {
		ret.id = ret._id.toString();
		delete ret._id;
		delete ret.__v;
		return ret;
	},
});

const Message = model("Message", MessageSchema);
export default Message;
