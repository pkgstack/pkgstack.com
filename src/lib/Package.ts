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
	// The directory where the packages are located.
	location: z.string().optional(),
	// Whether a lockfile should be generated or not.
	lockfile: z.enum(["never", "always", "auto"]).optional(),
	// The strategy that should be applied when multiple packages depend on different versions of the same package.
	// Possible values:
	// 	- parallel: Both versions get installed and each package gets it's own full version of the required package.
	// 	- manual: The user has to resolve the conflict manually.
	// 	- latest: The latest version of the package gets installed and all packages depend on that version.
	// 	- oldest: The oldest version of the package gets installed and all packages depend on that version.
	//	- default: The strategy that is set in the global config gets applied.
	//	- language: The strategy that works best with the language of the package gets applied.
	// 				If the language is unknown, the default strategy gets applied.
	conflictResolutionStrategy: z.enum(["parallel", "manual", "latest", "oldest", "default", "language"]).optional(),
})