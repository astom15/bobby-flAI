import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./user.resolver";
import { chatResolvers } from "./chat.resolver";
import { messageResolvers } from "./message.resolver";

const resolvers = mergeResolvers([
	userResolvers,
	chatResolvers,
	messageResolvers,
]);

export default resolvers;
