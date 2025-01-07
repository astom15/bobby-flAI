import { prisma } from "db";
import { Prisma } from "@prisma/client";
import { UserAttributes, EditUserInput } from "../../models/User";
import bcrypt from "bcrypt";

export const userResolvers = {
	Query: {
		getUser: async ({ id }: { id: number }): Promise<UserAttributes | null> => {
			try {
				const user = await prisma.user.findUnique({
					where: { id },
				});
				if (!user) {
					throw new Error(`User with id ${id} not found.`);
				}
				return user;
			} catch (err) {
				console.error("Error fetching user:", err);
				throw new Error("Failed to fetch user. Please try again later.");
			}
		},
	},
	Mutation: {
		createUser: async ({
			name,
			email,
			password,
			countryCode,
			region,
			allergies = [],
			preferences = [],
			imageUrl,
		}: Prisma.UserCreateInput): Promise<Prisma.UserCreateInput | null> => {
			try {
				const normalizedEmail = email.toLowerCase();
				const userExists = await prisma.user.findUnique({
					where: { email: normalizedEmail },
				});
				if (userExists) throw new Error("That email is already in use!");

				const hashedPassword = await bcrypt.hash(password, 10);
				return prisma.user.create({
					data: {
						name,
						email: normalizedEmail,
						password: hashedPassword,
						countryCode,
						region,
						allergies,
						preferences,
						imageUrl,
					},
				});
			} catch (err) {
				console.error("Error creating user:", err);
				throw new Error("Failed to create user.");
			}
		},
	},
};

// need to test this shit and also figure out how apollo server works with prisma servers
