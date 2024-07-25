import jwt from "jwt-simple";

export enum TokenType {
	Refresh,
	Access,
	Reset
}

export type TokenData = { uid: string, typ: TokenType, exp: number }

export function encodeToken(data: TokenData) {
	const token = jwt.encode(data, "yIvbgS$k7Bfc+mpV%TWDZAhje9#uJad4", "HS256");
	return token;
}

export function decodeToken(token: string): Partial<TokenData> {
	return jwt.decode(token, "yIvbgS$k7Bfc+mpV%TWDZAhje9#uJad4", true);
}