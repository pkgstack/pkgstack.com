---
title: The Config File
author: Moritz Utcke
description: Language agnostic package manager for the METALS toolchain
---

The config file is the most important part about Stack. It tells the package manager where things are located, what they are called and what do with all that information. This is the schema for it.

```json
{
	name: "my-package",
	version: "1.2.4",
	language: "cpp",
	description: "This is the description for my package",
	repository: "https://github.com/letsmoe/my-package",
	license: "MIT",
	author: {
		name: "Moritz Utcke",
		email: "email@example.com",
		url: "https://letsmoe.com",
	},
	dependencies: {
		"my-other-package": "1.2.3",
	},
	devDependencies: {
		"my-dev-package": "5.2.4",
	},
	maintainers: [{
		name: "Moritz Utcke",
		email: "email@example.com",
		url: "https://letsmoe.com",
	}],
	// The directory where the packages are located.
	location: "packages",
	// Whether a lockfile should be generated or not.
	lockfile: "never",
	// The strategy that should be applied when multiple packages depend on different versions of the same package.
	// Possible values:
	// 	- parallel: Both versions get installed and each package gets it's own full version of the required package.
	// 	- manual: The user has to resolve the conflict manually.
	// 	- latest: The latest version of the package gets installed and all packages depend on that version.
	// 	- oldest: The oldest version of the package gets installed and all packages depend on that version.
	//	- default: The strategy that is set in the global config gets applied.
	//	- language: The strategy that works best with the language of the package gets applied.
	// 				If the language is unknown, the default strategy gets applied.
	conflictResolutionStrategy: "parallel"
}
```