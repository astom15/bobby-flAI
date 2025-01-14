import { mergeTypeDefs } from "@graphql-tools/merge";
import { gql } from "graphql-tag";
import { print } from "graphql";
import fs from "fs";

// const isProd = process.env.NODE_ENV === "production";
const userSchema = gql(
	fs.readFileSync("./src/graphql/schemas/user.graphql", "utf8")
);
const chatSchema = gql(
	fs.readFileSync("./src/graphql/schemas/chat.graphql", "utf8")
);
const messageSchema = gql(
	fs.readFileSync("./src/graphql/schemas/message.graphql", "utf8")
);
// load appropriate config prod or dev
// const envSchema = isProd
// 	? gql`
// 			type ProdOnlyType {
// 				field: String
// 			}
// 		`
// 	: gql`
// 			type DevOnlyType {
// 				debugInfo: String
// 			}
// 		`;

const typeDefs = mergeTypeDefs([userSchema, chatSchema, messageSchema]);
const schemaAsString = print(typeDefs);

fs.writeFileSync("./schema.graphql", schemaAsString);

export default typeDefs;
