export type ApiListResponse<T> = {
	total: number;
	items: T[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
			...options,
		};
	}

	protected async request<T>(uri: string, init: RequestInit = {}): Promise<T> {
		const url = this.baseUrl + uri;

		const res = await fetch(url, {
			...this.options,
			...init,
			headers: {
				'Content-Type': 'application/json',
				...(this.options.headers || {}),
				...(init.headers || {}),
			},
		});

		if (!res.ok) {
			let error: any = { status: res.status, statusText: res.statusText };
			try {
				const data = await res.json();
				if (typeof data === 'object') {
					error = { ...error, ...data };
				}
			} catch {}
			throw error;
		}

		if (res.status === 204) {
			return undefined as unknown as T;
		}

		return (await res.json()) as T;
	}

	get<T>(uri: string): Promise<T> {
		return this.request<T>(uri, { method: 'GET' });
	}

	post<T>(
		uri: string,
		data?: unknown,
		method: ApiPostMethods = 'POST'
	): Promise<T> {
		return this.request<T>(uri, {
			method,
			body: data === undefined ? undefined : JSON.stringify(data),
		});
	}
}