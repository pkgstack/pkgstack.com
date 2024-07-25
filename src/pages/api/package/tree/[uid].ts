import type { APIRoute } from "astro";
import { prisma } from "#lib/server/db"
import { ErrorResponse, SuccessResponse } from "#lib/Response";

// Retrieves the entire dependency tree at once.
export const GET: APIRoute = async ({ params, props, request }) => {
	const { uid } = params;

	if (!uid) {
		return ErrorResponse("Missing resource id in request path.", {}, 400);
	}

	const pkg = await prisma.revision.findUnique({
		where: {
			id: uid
		},
		include: {
			author: true,
			dependencies: {
				include: {
					dependencies: true,
					devDependencies: true
				}
			},
			devDependencies: {
				include: {
					dependencies: true,
					devDependencies: true
				}
			},
			maintainers: true
		}
	})

	if (!pkg) {
		return ErrorResponse("Package could not be found.", {}, 404);
	}

	return SuccessResponse({
		_: {
			downloadUrl: `http://localhost:4321/archive/${pkg.name}/${pkg.version}.tar.gz`,
			resourceUrl: `http://localhost:4321/package/${pkg.id}`
		},
		...pkg
	});
}

