import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./user.resolver";
// import { messageResolvers } from "./message.resolver";
import { chatResolvers } from "./chat.resolver";

const resolvers = mergeResolvers([userResolvers, chatResolvers]);

export default resolvers;
