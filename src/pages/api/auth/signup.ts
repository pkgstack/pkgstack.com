import { generateHash } from "#lib/Hash";
import { ErrorResponse, SuccessResponse } from "#lib/Response";
import { prisma } from "#lib/server/db";
import type { APIRoute } from "astro";
import { z } from "astro/zod";

// Return an Access Token from a given refresh token
export const PUT: APIRoute = async ({ request }) => {
	const UserSignupValidator = z.object({
		email: z.string().email(),
		password: z.string().min(8),
		firstname: z.string(),
		lastname: z.string(),
		username: z.string()._addCheck({
			kind: "regex",
			regex: /^[a-zA-Z0-9_-]{3,32}$/,
			message: "Username may only contain letters, numbers, underscores, and hyphens and must be between 3 and 32 characters long."
		})
	});

	let body
	try {
		body = await request.json();
	} catch (e) {
		return ErrorResponse("Could not parse request body, expected to find JSON.", {});
	}	

	const validated = UserSignupValidator.safeParse(body);

	if (!validated.success) {
		return ErrorResponse("Invalid request body.", validated.error);
	}

	const { email, password, firstname, lastname } = validated.data;

	// Convert every username to lower case
	const username: string = validated.data.username.toLowerCase();

	const existingUser = await prisma.user.findFirst({
		where: {
			OR: [
				{
					email
				},
				{
					username
				}
			]
		}
	});

	if (existingUser) {
		if (existingUser.email === email) {
			return ErrorResponse("Email already in use.", {});
		} else if (existingUser.username === username) {
			return ErrorResponse("Username already in use.", {});
		}
	}

	const user = await prisma.user.create({
		data: {
			email,
			password: generateHash(password),
			firstname,
			lastname,
			username
		},
		select: {
			id: true
		}
	});

	return SuccessResponse({
		uid: user.id
	});
}