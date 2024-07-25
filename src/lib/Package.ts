import { z } from "astro:content";

export const PackageValidator = z.object({
	author: z.object({
		name: z.string(),
		email: z.string().email().optional(),
		url: z.string().url().optional(),
	}),
	name: z.string(),
	version: z.string(),
	language: z.string().optional(),
	description: z.string().optional(),
	repository: z.string().url(),
	license: z.string().optional(),
	dependencies: z.record(z.string()).optional(),
	devDependencies: z.record(z.string()).optional(),
	maintainers: z.array(z.object({
		name: z.string(),
		email: z.string().email().optional(),
		url: z.string().url().optional(),
	})).optional(),
})