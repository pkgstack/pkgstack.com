import crypto from "crypto";

// Verify a package signature using our private key
export function verifyPackageSignature(data: Buffer, signature: string): boolean {
	const verifier = crypto.createVerify("sha256");
	verifier.update(data);
	verifier.end()

	const publicKey = process.env.PUBLIC_KEY;

	if (!publicKey) {
		throw new Error("No public key was found in the environment variables.");
	}

	return verifier.verify(publicKey, signature, "base64");
}

// Generate the package signature using the public key
export function generatePackageSignature(data: Buffer): string {
	const signer = crypto.createSign("sha256");
	signer.update(data);	
	signer.end()

	const privateKey = process.env.PRIVATE_KEY;

	if (!privateKey) {
		throw new Error("No private key was found in the environment variables.");
	}

	return signer.sign(privateKey, "base64");
}