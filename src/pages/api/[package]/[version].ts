import type { APIRoute } from "astro";
import { prisma } from "#lib/server/db"
import semver from "semver";
import { SuccessResponse } from "#lib/Response";

export const GET: APIRoute = async ({ params, props, request, redirect }) => {
	const { package: packageName, version } = params;

	if (!packageName || !version) {
		return new Response("Missing package or version" ,{ status: 400 });
	}

	const parsedVersion = semver.coerce(version, {
		includePrerelease: true,
	});

	if (!parsedVersion) {
		return new Response("Invalid version, please make sure to pass a semver compatible version", { status: 400 });
	}

	const pkg = await prisma.revision.findUnique({
		where: {
			version_name: {
				name: packageName,
				version: parsedVersion.toString()
			}
		},
		include: {
			author: true,
			dependencies: {
				select: {
					name: true,
					version: true
				}
			},
			devDependencies: {
				select: {
					name: true,
					version: true
				}
			},
			maintainers: true,
		}
	})

	if (!pkg) {
		return new Response("Package not found", { status: 404 });
	}

	return SuccessResponse({
		_: {
			downloadUrl: `http://localhost:4321/archive/${pkg.name}/${pkg.version}.tar.gz`,
		},
		...pkg
	});
}

