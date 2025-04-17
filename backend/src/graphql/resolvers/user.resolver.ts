import { prisma } from "db";
import { Prisma } from "@prisma/client";
import { EditUserInput, ItemRemoval, IUser } from "../../interfaces/IUser";
import bcrypt from "bcrypt";
import { updateArrayItems } from "src/services/users.service";
import Errors from "src/errors/errorFactory";
import { logError } from "src/services/errorLogger.service";

export const userResolvers = {
	Query: {
		getUser: async (
			_parent: unknown,
			{ id }: { id: string }
		): Promise<IUser | null> => {
			try {
				const user = await prisma.users.findUnique({
					where: { id },
				});
				if (!user) {
					throw Errors.User.notFound(id);
				}
				return user;
			} catch (err) {
				logError(Errors.User.fetchFailed(err), { id });
				throw Errors.User.fetchFailed(err);
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
				if (userExists) throw Errors.User.emailInUse(normalizedEmail);

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
				logError(Errors.User.createFailed(err), {
					name,
					email,
					allergies,
					preferences,
				});
				throw Errors.User.createFailed(err);
			}
		},
		// this causes an issue later because recipes, chats, and others will have a user id.
		// cascade delete or should i just keep them and have a ghost ID
		deleteUser: async (
			_parent: unknown,
			{ id }: { id: string }
		): Promise<string> => {
			try {
				const deletedUser = await prisma.users.delete({ where: { id } });
				return deletedUser.id;
			} catch (err) {
				logError(Errors.User.deleteFailed(err), { id });
				throw Errors.User.deleteFailed(err);
			}
		},
		editUser: async (
			_parent: unknown,
			{
				id,
				input,
				removalInput,
			}: { id: string; input: EditUserInput; removalInput: ItemRemoval }
		): Promise<Prisma.UsersUpdateInput> => {
			try {
				const user = await prisma.users.findUnique({ where: { id } });
				if (!user) {
					throw Errors.User.notFound(id);
				}
				const updatedData = { ...input };
				updatedData.allergies = updateArrayItems(
					user.allergies,
					input?.allergies,
					removalInput?.allergies
				);
				updatedData.preferences = updateArrayItems(
					user.preferences,
					input?.preferences,
					removalInput?.preferences
				);
				const updatedUser = await prisma.users.update({
					where: { id },
					data: updatedData,
				});
				return updatedUser;
			} catch (err) {
				logError(Errors.User.updateFailed(err), { id });
				throw Errors.User.updateFailed(err);
			}
		},
	},
};
