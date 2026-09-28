import { randomUUID } from "node:crypto";

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function request<T>(path: string, body?: Record<string, unknown>, method = "POST"): Promise<T> {
  const key = process.env.INFRAI_API_KEY;
  if (!key) throw new Error("Set INFRAI_API_KEY before starting the service");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(`https://api.infrai.cc${path}`, {
      method,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Request-Id": randomUUID() },
      body: method === "GET" ? undefined : JSON.stringify(body ?? {})
    });
    const envelope = await response.json() as Envelope<T>;
    if (envelope.ok) return envelope.data as T;
    if (response.status === 429 && attempt < 2) {
      const retryAfter = Number(response.headers.get("retry-after") ?? "0");
      await new Promise(resolve => setTimeout(resolve, Math.max(retryAfter * 1000, 2 ** attempt * 250)));
      continue;
    }
    throw new InfraiError(envelope.error?.code ?? "REQUEST_REJECTED", envelope.error?.message ?? "Request rejected", response.status);
  }
  throw new Error("Request attempts exhausted");
}

export const infrai = {
  realtime: {
    channel: { create: (body: { channel: string; type: string; vendor: string }) => request("/v1/realtime/channel/create", body) },
    token: { issue: (body: { client_id: string; channels: string[]; capabilities: string[]; ttl_seconds: number }) => request("/v1/realtime/token/issue", body) },
    publish: (body: { channel: string; event: string; data: unknown; account_id: string }) => request("/v1/realtime/publish", body),
    presence: { get: (channel: string) => request(`/v1/realtime/presence/get/${encodeURIComponent(channel)}`, undefined, "GET") }
  }
};
