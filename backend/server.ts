import { app, createDBContextMiddleware } from "app";
import { mongoClient, prisma, initializeMongoDB } from "db";
import chats from "routes/chat";
const PORT = process.env.MONGO_PORT || 3000;

const startServer = async () => {
	try {
		const mongoDb = await initializeMongoDB();
		app.use(createDBContextMiddleware(prisma, mongoDb));
		app.use("/chats", chats);
		app.listen(PORT, () => {
			console.log("Server running at http://localhost:" + PORT);
		});

		process.on("SIGINT", async () => {
			console.log("Shutting down gracefully...");
			await prisma.$disconnect();
			await mongoClient.close();
			console.log("Connections closed. Goodbye!");
			process.exit(0);
		});
	} catch (err) {
		console.error("Error starting the server:", err);
		process.exit(1);
	}
};

startServer();
