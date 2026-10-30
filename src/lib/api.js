// Tiny fetch wrapper. Throws an Error
// whose `.message` is the server's friendly text and `.status` / `.data` carry
// the rest, so callers can `try/catch` and show the message directly.

export class ApiError extends Error {
	constructor(message, status, data) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.data = data || {};
	}
}

async function request(method, path, body) {
	let res;
	try {
		res = await fetch(path, {
			method,
			credentials: "include",
			headers: body ? { "Content-Type": "application/json" } : undefined,
			body: body ? JSON.stringify(body) : undefined,
		});
	} catch {
		throw new ApiError("Network error — please check your connection and try again.", 0);
	}

	let data = null;
	const text = await res.text();
	if (text) {
		try {
			data = JSON.parse(text);
		} catch {
			data = { error: text };
		}
	}

	if (!res.ok) {
		const message =
			(data && (data.error || data.message)) ||
			"Something went wrong. Please try again.";
		throw new ApiError(message, res.status, data);
	}
	return data;
}

export const api = {
	get: (path) => request("GET", path),
	post: (path, body) => request("POST", path, body),
};
