import { generateHash } from "#lib/Hash";
import { ErrorResponse, SuccessResponse } from "#lib/Response";
import { prisma } from "#lib/server/db";
import { encodeToken, TokenType } from "#lib/Token";
import type { APIRoute } from "astro";

// Return a Refresh Token given the correct authorization credentials
export const GET: APIRoute = async ({ request }) => {
	const authorization = request.headers.get("Authorization");

	if (!authorization) {
		return ErrorResponse("No authorization credentials provided", {}, 401);
	}

	if (authorization.split(" ")[0] !== "Basic") {
		return ErrorResponse("Invalid authorization method, expected Basic", {}, 401);
	}

	const [email, password] = atob(authorization.split(" ")[1]).split(":");	

	const user = await prisma.user.findUnique({
		where: {
			email
		}
	});	

	if (!user || (generateHash(password) !== user.password)) {
		return ErrorResponse("Invalid credentials or user doesn't exist", {}, 401);
	}

	const refreshToken = encodeToken({
		exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
		uid: user.id,
		typ: TokenType.Refresh
	});

	const token = await prisma.refreshToken.create({
		data: {
			token: refreshToken,
			user: {
				connect: {
					id: user.id
				}
			},
			valid: true,
		}
	})

	return SuccessResponse({
		refreshToken
	});
}