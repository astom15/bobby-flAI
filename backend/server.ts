import { app, createDBContextMiddleware } from "app";
import { prisma, initializeMongoDB } from "db";
import { ApolloServer } from "@apollo/server";
import {
	ExpressContextFunctionArgument,
	expressMiddleware,
} from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import typeDefs from "src/graphql/schemas";
import resolvers from "src/graphql/resolvers/index.resolver";
import chatRouter from "src/routes/chat";
import http from "http";

const PORT = 4000;
const httpServer = http.createServer(app);
const server = new ApolloServer({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
const startServer = async () => {
	try {
		const mongoDb = await initializeMongoDB();
		app.use(createDBContextMiddleware(prisma, mongoDb));
		await server.start();
		app.use(
			"/graphql",
			expressMiddleware(server, {
				context: async ({ req }: ExpressContextFunctionArgument) => {
					try {
						const token = Array.isArray(req.headers.token)
							? req.headers.token[0]
							: req.headers.token;

						return {
							token: token as string | undefined,
							prisma: req.context.prisma,
							mongoDb: req.context.mongoDb,
						};
					} catch (err) {
						console.error("Error in context middleware:", err);
						throw new Error("Context initialization failed");
					}
				},
			})
		);
		app.use("/chats", chatRouter);
		await new Promise<void>((resolve) => httpServer.listen(PORT, resolve));
		console.log(`Server running at http://localhost:${PORT}/graphql`);
		process.removeAllListeners("SIGINT");
		process.on("SIGINT", async () => {
			console.log("Shutting down gracefully...");
			try {
				await Promise.race([
					Promise.all([prisma.$disconnect(), mongoDb.close()]),
					new Promise((_, reject) =>
						setTimeout(() => reject(new Error("Cleanup timeout")), 5000)
					),
				]);
				console.log("Connections closed. Goodbye!");
			} catch (err) {
				console.error("Error during cleanup:", err);
			} finally {
				process.exit(0);
			}
		});
	} catch (err) {
		console.error("Error starting the server:", err);
		process.exit(1);
	}
};

startServer();
