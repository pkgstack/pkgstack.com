import { PackageValidator } from "#lib/Package";
import { ErrorResponse, SuccessResponse } from "#lib/Response";
import { prisma } from "#lib/server/db";
import { decodeToken } from "#lib/Token";
import type { APIRoute } from "astro";
import { z } from "astro:content";
import semver from "semver";
import crypto from "crypto";
import * as fs from "fs"
import { generatePackageSignature, verifyPackageSignature } from "#lib/PackageHash";

export const GET: APIRoute = async ({ request }) => {
	const packageCount = await prisma.revision.count();


	return SuccessResponse({
		"db_name": "registry",
		"pkg_count": packageCount,
		"instance_start_time": (new Date()).getTime(),
	});
};

export const PUT: APIRoute = async ({ params, props, request }) => {
	let body: any;
	const authorization = request.headers.get("Authorization");

	if (!authorization) {
		return ErrorResponse("No authorization credentials provided", {}, 401);
	}

	const [method, token] = authorization.split(" ");

	if (method !== "Bearer") {
		return ErrorResponse("Invalid authorization method, expected Bearer", {}, 401);
	}

	const tokenData = decodeToken(token);

	if (!tokenData) {
		return ErrorResponse("Invalid token", {}, 401);
	}

	const author = await prisma.user.findUnique({
		where: {
			id: tokenData.uid
		}
	})

	if (!author) {
		return ErrorResponse("User not found", {}, 401);
	}

	try {
		body = await request.json();
	} catch (e) {
		return ErrorResponse("Invalid JSON in committed package description.", {});
	}	

	const validated = PackageValidator.merge(z.object({
		_: z.object({
			package: z.string()
		})
	})).safeParse(body);

	if (!validated.success) {
		return ErrorResponse("Invalid package description", validated.error);
	}

	const packageVersion = validated.data.version;
	const packageName = validated.data.name;

	if (!semver.valid(packageVersion)) {
		return ErrorResponse("Invalid version, please make sure to pass a semver compatible version", {}, 400);
	}

	// const revisions = await prisma.revision.findMany({
	// 	where: {
	// 		name: packageName
	// 	}
	// });

	// // Sort revisions by their version number
	// const sortedRevisions = revisions.sort((a, b) => {
	// 	return semver.compare(a.version, b.version);
	// })

	// const latestRevision = sortedRevisions.at(-1)

	// // Check if the latest revision had a higher or same build number as the revision that is currently trying to be pushed
	// if (semver.compare(latestRevision?.version, validated.data.version) !== -1) {
	// 	return ErrorResponse("The version of the currently pushed revision must be higher than that of the latest revision.", {
	// 		latest: latestRevision,
	// 		current: validated
	// 	})
	// }

	// Check if the package already exists.
	const pkg = await prisma.revision.findFirst({
		where: {
			name: validated.data.name
		}
	})

	if (pkg) {
		return ErrorResponse("This package already exists. Please make sure to use UPDATE as a request method when updating packages.", {}, 400);
	}


	// Resolve all dependencies
	const dependencies = [];

	if (validated.data.dependencies) {
		for (const [name, version] of Object.entries(validated.data.dependencies)) {			
			const semanticVersion = semver.coerce(version)

			if (!semanticVersion) {
				return ErrorResponse("Invalid version number in dependency listing.", {
					version,
					name
				}, 400);
			}

			const dep = await prisma.revision.findUnique({
				where: {
					version_name: {
						name,
						version: semanticVersion.version
					}
				}
			});
	
			if (!dep) {
				return ErrorResponse("No suitable registered dependency matched the given conditions.", {
					name, version: semanticVersion.version
				}, 400);
			}
	
			dependencies.push({
				id: dep.id
			})
		}
	}

	if (validated.data.devDependencies) {
		for (const [name, version] of Object.entries(validated.data.devDependencies)) {			
			const semanticVersion = semver.coerce(version)

			if (!semanticVersion) {
				return ErrorResponse("Invalid version number in dev dependency listing.", {
					version,
					name
				}, 400);
			}

			const dep = await prisma.revision.findUnique({
				where: {
					version_name: {
						name,
						version: semanticVersion.version
					}
				}
			});
	
			if (!dep) {
				return ErrorResponse("No suitable registered dependency matched the given conditions.", {
					name, version: semanticVersion.version
				}, 400);
			}
	
			dependencies.push({
				id: dep.id
			})
		}
	}

	// Verify the package signature
	const buffer = Buffer.from(validated.data._.package, "base64");
	const signature = generatePackageSignature(buffer);

	// Save the package to the database and write the package into the archive
	const archivePath = `./archive/${packageName}-${packageVersion}.tar.gz`;

	fs.writeFileSync(archivePath, buffer);

	await prisma.revision.create({
		data: {
			name: packageName,
			description: validated.data.description,
			downloads: 0,
			downloadsLastMonth: 0,
			repository: validated.data.repository,
			size: buffer.byteLength,
			signature,
			version: packageVersion,
			language: validated.data.language,
			license: validated.data.license,
			devDependencies: validated.data.devDependencies,
			dependencies: {
				connect: dependencies
			},
			author: {
				connect: {
					id: author.id
				}
			},
		}
	});
	
	return SuccessResponse("Package was successfully added to the archive!", 200);
}