import mongoose from "mongoose";
import Message, { IMessage } from "./Message";
import { v4 as uuidv4 } from "uuid";
const { Schema, model } = mongoose;
export interface IChat {
	id: string;
	userId: string;
	name: string;
	messages?: IMessage[];
	createdAt: Date;
	updatedAt: Date;
}
export interface IChatPreview {
	id: string;
	name: string;
	updatedAt: NativeDate;
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
			index: true,
		},
		name: {
			type: String,
			required: true,
			default: "New chat",
		},
		status: {
			type: String,
			enum: Object.values(ChatStatus),
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
ChatSchema.pre("findOneAndDelete", async function (next) {
	const chat = await this.model.findOne(this.getQuery());
	if (chat) {
		await Message.deleteMany({ chatId: chat._id });
	}
	next();
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
