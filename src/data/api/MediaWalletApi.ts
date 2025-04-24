import { fabricConfigStore } from "@/data/stores";
import { ZodType } from "zod/lib/types";
import { PagedContentSchema } from "@/data/models/PagedContentModel";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";

export const MediaWalletApi = {
  getProperties(): Promise<MediaPropertyModel[]> {
    return request("GET", "properties", PagedContentSchema(MediaPropertyModel), { include_public: true })
      .then(response => response.contents);
  }
};

async function request<R>(method: "GET" | "POST", path: string, resultParser: ZodType<R, any, any>, query: any = {}) {
  return fabricConfigStore.promiseConfig().then(async config => {
    const url = new URL(fabricConfigStore.config!.authdBaseUrl);
    url.pathname += "/mw/" + path;
    Object.keys(query).forEach((key) => {
      url.searchParams.set(key, query[key]);
    });
    console.log("going to fetch " + url);
    const response: Response = await fetch(url, { method });
    const json = await response.json();
    let result = resultParser.parse(json);
    console.log("fetched: ", result);
    return result;
  });
}
