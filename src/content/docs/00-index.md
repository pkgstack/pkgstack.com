---
title: Stack
author: Moritz Utcke
description: A language-agnostic package manager
---


A language-agnostic package manager that allows you to manage dependencies for your projects.
It is built on top of the [METALS IL](/docs/metals) and comes with its own CLI. It is designed to allow interoperability between different languages.

## How does Stack work?

At the core Stack maintains two versions of the same package. One is the original source code of the package and the other is the compiled version of it. Every package gets compiled to METALS IL and then stored in the cache. This allows for faster compilation times and better performance. Depending on your project, you can use the original source code if the program was written using the same language as your project. However, sometimes you might want to include a package that was written using a different language. In this case, you can use the compiled version which will be linked once you compile your project.

## Terminology

- **Package**: A package is a collection of source files that are compiled into METALS IL.
- **Dependency**: A package that is required by another package.
- **Push**: Pushing a package means to add it to the dependency list.
- **Pop**: Popping a package means to remove it from the dependency list.

## Semantic Versioning

Stack uses semantic versioning to manage dependencies. This means that you can specify a range of versions that are compatible with your project. For example, if you want to use a package that is compatible with version 1.0.0 and above, you can specify `^1.0.0` as the version range.

## Commands

- `stack init`: Initializes a new project.
- `stack push <package>`: Adds a package to the dependency list.
- `stack pop <package>`: Removes a package from the dependency list.
- `stack install [package]`: Installs all dependencies or a specific package.
- `stack update [package]`: Updates all dependencies or a specific package to the latest compatible version.