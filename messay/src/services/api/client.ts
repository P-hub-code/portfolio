/**
 * client.ts
 * ---------------------------------
 * Client HTTP pour les appels API Messay
 */

const BASE_URL = 'https://messe-api.kaddeshgroup.com';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
    method?: HttpMethod;
    body?: object;
    token?: string | null;
    headers?: Record<string, string>;
}

export async function apiRequest<T>(
    path: string,
    config: RequestConfig = {}
): Promise<T> {
    const { method = 'GET', body, token, headers = {} } = config;

    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
        method,
        headers: requestHeaders,
    };

    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json().catch(() => ({}));

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/f5793858-49d9-4eea-a7b8-75c5f253451f',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c88777'},body:JSON.stringify({sessionId:'c88777',location:'client.ts:apiRequest',message:'API response',data:{path,status:response.status,ok:response.ok,bodyKeys:body?Object.keys(body):[]},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
        const message =
            data?.message || data?.error || `Erreur ${response.status}`;
        const err = new Error(message) as Error & {
            status?: number;
            data?: Record<string, unknown>;
        };
        err.status = response.status;
        err.data = data as Record<string, unknown>;
        throw err;
    }

    return data as T;
}
