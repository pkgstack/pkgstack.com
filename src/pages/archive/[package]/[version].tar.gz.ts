import { ErrorResponse } from "#lib/Response";
import { prisma } from "#lib/server/db";
import type { APIRoute } from "astro";
import * as fs from "fs"
import * as path from "path"

// Retrieves a tarball from the archive of the requested package
export const GET: APIRoute = async ({ request, params }) => {
	const { package: packageName, version } = params;

	if (!packageName || !version) {
		return ErrorResponse("Please provide a package name and version number.", {}, 404);
	}

	const archive = `./archive`

	const file = path.join(archive, `${packageName}-${version}.tar.gz`)

	if (!fs.existsSync(file)) {
		return ErrorResponse("File not found", {}, 404);
	}

	// Increase the download count
	await prisma.revision.update({
		where: {
			version_name: {
				version,
				name: packageName
			}
		},
		data: {
			downloads: {
				increment: 1
			},
			downloadsLastMonth: {
				increment: 1
			}
		}
	})

	const fileObject = fs.readFileSync(file)

	return new Response(fileObject, {
		headers: {
			"Content-Type": "application/gzip",
			"Content-Disposition": `attachment; filename=${packageName}-${version}.tar.gz`
		}
	})
}