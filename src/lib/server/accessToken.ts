import { decodeToken, encodeToken, TokenType, type TokenData } from "#lib/Token";
import { prisma } from "./db";

export function accessTokenValid(accessToken: string): false | Partial<TokenData> {
	const data = decodeToken(accessToken);

	if (!data || !data.exp || data.exp < Date.now() / 1000) {
		return false;
	}

	return data;
}

export function generateAccessToken(uid: string) {
	const data = {
		exp: Date.now() / 1000 + 60 * 60 * 24 * 7,
		typ: TokenType.Access,
		uid
	}

	return {
		token: encodeToken(data),
		data
	}
}

export async function generateAccessTokenFromRefreshToken(refreshToken: string): Promise<ReturnType<typeof generateAccessToken> | null> {
	const token = await prisma.refreshToken.findUnique({
		where: {
			token: refreshToken
		}
	})

	if (!token || !token.valid) {
		return null;
	}

	const accessToken = generateAccessToken(token.userId);

	return accessToken;
}