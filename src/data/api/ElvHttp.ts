import { fetch, FetchRequestInit } from "expo/fetch";
import { tokenStore } from "@/data/stores";
import Log from "@/utils/Log";
import { FetchResponse } from "expo/build/winter/fetch/FetchResponse";
import type { NativeHeadersType } from "expo/src/winter/fetch/NativeRequest";
import { router } from "expo-router";
import { runInAction } from "mobx";

//  This token is pre-generated for the "main" network
const staticToken = "eyJxc3BhY2VfaWQiOiAiaXNwYzJSVW9SZTllUjJ2MzNIQVJRVVZTcDFyWVh6dzEifQ==";

export default async function makeAuthServiceRequest(url: string, init?: FetchRequestInit): Promise<FetchResponse> {
  init = init || {};
  const token = runInAction(() => tokenStore.fabricToken) || staticToken;
  let headers = normalizeHeadersInit(init?.headers);
  init.headers = overrideHeaders(headers, [["Authorization", `Bearer ${token}`]]);
  try {
    const response = await fetch(url, init);
    if (response.status == 403) {
      // Token probably expired. Until we have a refresh API, just signout and pop to root
      tokenStore.signOut();
      router.dismissTo("/");
    }
    return response;
  } catch (e) {
    Log.e("API ERROR", e);
    throw e;
  }
}

// Copied from Expo because imports wouldn't work:
/**
 * Normalize a HeadersInit object to an array of key-value tuple for NativeRequest.
 */
function normalizeHeadersInit(headers: HeadersInit | null | undefined): NativeHeadersType {
  if (headers == null) {
    return [];
  }
  if (Array.isArray(headers)) {
    return headers;
  }
  if (headers instanceof Headers) {
    const results: [string, string][] = [];
    headers.forEach((value: any, key: any) => {
      results.push([key, value]);
    });
    return results;
  }
  return Object.entries(headers);
}

/**
 * Create a new header array by overriding the existing headers with new headers (by header key).
 */
export function overrideHeaders(
  headers: NativeHeadersType,
  newHeaders: NativeHeadersType
): NativeHeadersType {
  const newKeySet = new Set(newHeaders.map(([key]) => key.toLocaleLowerCase()));
  const result: NativeHeadersType = [];
  for (const [key, value] of headers) {
    if (!newKeySet.has(key.toLocaleLowerCase())) {
      result.push([key, value]);
    }
  }
  for (const [key, value] of newHeaders) {
    result.push([key, value]);
  }
  return result;
}
