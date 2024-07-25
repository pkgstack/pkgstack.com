import { ErrorResponse, SuccessResponse } from "#lib/Response";
import { prisma } from "#lib/server/db";
import { encodeToken, TokenType } from "#lib/Token";
import type { APIRoute } from "astro";

// Return an Access Token from a given refresh token
export const GET: APIRoute = async ({ request }) => {
	const authorization = request.headers.get("Authorization");

	if (!authorization) {
		return ErrorResponse("No Authorization header provided", {}, 401);
	}

	const refreshToken = authorization.split(" ")[1];

	const token = await prisma.refreshToken.findUnique({
		where: {
			token: refreshToken
		}
	});

	if (!token) {
		return ErrorResponse("Invalid refresh token", {}, 401);
	}

	const user = await prisma.user.findUnique({
		where: {
			id: token.userId
		}
	});

	if (!user) {
		return ErrorResponse("User not found", {}, 401);
	}

	const accessToken = encodeToken({
		exp: Date.now() + 1000 * 60 * 60,
		typ: TokenType.Access,
		uid: user.id
	});

	return SuccessResponse({
		accessToken
	});
}