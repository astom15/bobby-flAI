import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";

export default tseslint.config(
	{
		ignores: [
			"dist/", // exclude specific folder
			"**/*.js", // exclude all JavaScript files
		],
	},
	{
		files: ["**/*.ts"],
		extends: [eslint.configs.recommended, ...tseslint.configs.strict],
	},
	{
		files: ["**/*.graphql"],
		languageOptions: {
			parser: graphqlPlugin.parser,
			parserOptions: {
				schema: "./schema.graphql", // Path to the static merged schema file
			},
		},
		plugins: {
			"@graphql-eslint": graphqlPlugin,
		},
		rules: {
			"@graphql-eslint/known-type-names": "error",
		},
	}
);
