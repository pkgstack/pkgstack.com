import crypto from "crypto";

export function generateHash(data: string): string {
	return crypto.createHash("sha256").update(data).digest("base64");
}