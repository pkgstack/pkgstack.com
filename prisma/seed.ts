import { prisma } from "../src/lib/server/db";
import { generateHash } from "../src/lib/Hash";
import * as fs from "fs";
import {
	generatePackageSignature,
	verifyPackageSignature,
} from "../src/lib/PackageHash";
import { faker } from "@faker-js/faker";
import { version } from "bun";

// await prisma.user.create({
// 	data: {
// 		email: "moritz.utcke@gmx.de",
// 		password: generateHash("password"),
// 		name: "moritz"
// 	}
// })

// Get the refresh and access token
const refreshToken = (
	await (
		await fetch("http://localhost:4321/api/auth/refreshtoken", {
			headers: {
				Authorization: "Basic " + btoa("moritz.utcke@gmx.de:password"),
			},
		})
	).json()
).body.refreshToken;

console.log(refreshToken);


// Get the access token
const accessToken = (
	await (
		await fetch("http://localhost:4321/api/auth/accesstoken", {
			headers: {
				Authorization: "Bearer " + refreshToken,
			},
		})
	).json()
).body.accessToken;

console.log(accessToken);


// Create default packages
const gzipPackage = fs.readFileSync("./packages/package-1.0.0.tar.gz").toString("base64");

function createRandomPackage(seed: number) {
	faker.seed(seed);
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();

	const maintainers: any[] = [];

	for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
		maintainers.push({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			url: faker.internet.url(),
		});
	}

	return {
		author: {
			name: `${firstName} ${lastName}`,
			email: faker.internet.email({
				firstName, lastName
			}),
			url: faker.internet.url(),
		},
		name: faker.commerce.productName().replace(/ /g, "-").replace(/-+/g, "-").toLowerCase(),
		version: faker.system.semver(),
		language: faker.hacker.noun(),
		description: faker.lorem.sentence(),
		repository: faker.internet.url(),
		license: faker.number.int({
			min: 0,
			max: 1,
		}) === 0 ? "MIT" : "GPL",
		dependencies: {},
		devDependencies: {},
		maintainers
	}
}

// Generates a flat array of dependencies in the correct order for database insertion.
// This will ensure a tree of dependencies is created correctly.
function recursivePackageGenerator(seed: number = 42, maxDependenciesPerStep: number = 10, depth: number = 1) {
	faker.seed(seed);
	const packages: any[] = [];

	const packageCount = faker.number.int({ min: 1, max: maxDependenciesPerStep });

	for (let i = 0; i < packageCount; i++) {
		const packageData = createRandomPackage(seed + i);
		packages.unshift(packageData);

		if (depth > 0) {
			const dependencies = recursivePackageGenerator(seed + i + 1, maxDependenciesPerStep, depth - 1);
			for (const dependency of dependencies.reverse()) {
				packageData.dependencies[dependency.name] = dependency.version;
				packages.unshift(dependency)
			}
		}
	}

	return packages;
}

const packages = recursivePackageGenerator(42, 5, 3);

for (const pkg of packages) {
	await fetch("http://localhost:4321/api/", {
		method: "PUT",
		headers: {
			Authorization: "Bearer " + accessToken,
		},
		body: JSON.stringify({
			_: {
				package: gzipPackage
			},
			...pkg,
		}),
	});
}