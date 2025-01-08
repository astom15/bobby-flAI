import { prisma } from "db";
import { Prisma } from "@prisma/client";
import { EditUserInput, UserAttributes } from "../../models/User";
import bcrypt from "bcrypt";

export const userResolvers = {
	Query: {
		getUser: async (
			_parent: unknown,
			{ id }: { id: number }
		): Promise<UserAttributes | null> => {
			try {
				const user = await prisma.users.findUnique({
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
		createUser: async (
			_parent: unknown,
			{
				name,
				email,
				password,
				allergies,
				preferences,
				countryCode,
				region,
				imageUrl,
			}: Prisma.UsersCreateInput
		): Promise<Prisma.UsersCreateInput | null> => {
			try {
				const normalizedEmail = email.toLowerCase();
				const userExists = await prisma.users.findUnique({
					where: { email: normalizedEmail },
				});
				if (userExists) throw new Error("That email is already in use!");

				const hashedPassword = await bcrypt.hash(password, 10);
				return prisma.users.create({
					data: {
						name,
						email: normalizedEmail,
						password: hashedPassword,
						allergies,
						preferences,
						countryCode,
						region,
						imageUrl,
					},
				});
			} catch (err) {
				console.error("Error creating user:", err);
				throw new Error("Failed to create user.");
			}
		},
		// this causes an issue later because recipes, chats, and others will have a user id.
		// cascade delete or should i just keep them and have a ghost ID
		deleteUser: async (
			_parent: unknown,
			{ id }: { id: number }
		): Promise<number> => {
			try {
				const deletedUser = await prisma.users.delete({ where: { id } });
				return deletedUser.id;
			} catch (err) {
				console.log("Error deleting user:", err);
				throw new Error("Failed to delete user.");
			}
		},
		editUser: async (
			_parent: unknown,
			{ id, input }: { id: number; input: EditUserInput }
		): Promise<Prisma.UsersUpdateInput> => {
			try {
				const user = await prisma.users.findUnique({ where: { id } });
				if (!user) {
					throw new Error(`User ${id} not found.`);
				}
				const updatedData = { ...input };
				// i have to handle specific removal of allergies, this just adds more every time.
				if (input.allergies) {
					const updatedAllergies = [
						...(user.allergies || []),
						...input.allergies,
					];
					updatedData.allergies = Array.from(new Set(updatedAllergies));
				}
				if (input.preferences) {
					const updatedPrefs = [
						...(user.preferences || []),
						...input.preferences,
					];
					updatedData.preferences = Array.from(new Set(updatedPrefs));
				}
				const updatedUser = await prisma.users.update({
					where: { id },
					data: updatedData,
				});
				return updatedUser;
			} catch (err) {
				console.log("Error deleting user:", err);
				throw new Error("Failed to update user.");
			}
		},
	},
};

// need to test this shit and also figure out how apollo server works with prisma servers
