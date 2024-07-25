export const SuccessResponse = (body: any, status: number = 200) => {
	return new Response(JSON.stringify({
		status,
		body
	}), { status });
}

export const ErrorResponse = (message: string, info: any, status: number = 400) => {
	return new Response(JSON.stringify({
		status,
		message,
		info
	}), { status });
}