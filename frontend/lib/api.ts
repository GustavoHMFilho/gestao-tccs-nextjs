import type { ApiList } from "./types";

const API_BASE = "/api/backend";

function messageFrom(data: unknown) {
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    return Object.entries(data as Record<string, unknown>)
      .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
      .join(" | ");
  }
  return "Não foi possível concluir a operação.";
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}/${path.replace(/^\//, "")}`, {
    cache: "no-store",
    ...init,
  });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) throw new Error(messageFrom(data));
  return data as T;
}

export function unwrap<T>(data: ApiList<T>): T[] {
  return Array.isArray(data) ? data : data.results;
}

export async function getList<T>(path: string): Promise<T[]> {
  return unwrap(await api<ApiList<T>>(path));
}
