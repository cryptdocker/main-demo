import { mockBackendRequest } from "../mocks/mockBackend";

export class ApiError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

export async function apiFetch<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const url = path.startsWith("http") ? path : path.startsWith("/") ? path : `/${path}`;
	const method = String(init?.method ?? "GET").toUpperCase();
	const headersInit = init?.headers ?? {};
	const headers: Record<string, string> = {};

	if (headersInit instanceof Headers) {
		headersInit.forEach((value, key) => {
			headers[key] = value;
		});
	} else if (Array.isArray(headersInit)) {
		for (const [k, v] of headersInit) headers[k] = v;
	} else {
		Object.assign(headers, headersInit as Record<string, string>);
	}

	const rawBody = init?.body;
	const body =
		rawBody && typeof rawBody === "string"
			? rawBody
			: rawBody instanceof FormData
				? rawBody
				: rawBody;

	const reply = await mockBackendRequest({
		url,
		method: method as any,
		headers: {
			Accept: "application/json",
			...headers,
		},
		body,
	});

	if (!reply.ok) {
		const payload = reply.body as any;
		const message =
			(typeof payload === "object" &&
			payload !== null &&
			("error" in payload || "message" in payload)
				? String(payload.error ?? payload.message ?? "")
				: typeof payload === "string"
					? payload
					: "") || `Request failed (${reply.status})`;
		throw new ApiError(message, reply.status);
	}

	return reply.body as T;
}
