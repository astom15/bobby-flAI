import { mergeResolvers } from "@graphql-tools/merge";
import { userResolvers } from "./user.resolver";

const resolvers = mergeResolvers([userResolvers]);

export default resolvers;
