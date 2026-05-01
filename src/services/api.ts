/** Demo build — no HTTP client. Keeps ApiError for shared error typing in UI. */
export class ApiError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

export async function apiFetch<T>(_path: string, _init?: RequestInit): Promise<T> {
	throw new ApiError(
		"This demo frontend does not call the production CryptDocker API.",
		503,
	);
}
