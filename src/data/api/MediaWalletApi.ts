import { fabricConfigStore } from "@/data/stores";
import { ZodType } from "zod/lib/types";
import { PagedContentSchema } from "@/data/models/PagedContentModel";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";

export const MediaWalletApi = {
  getProperties(): Promise<MediaPropertyModel[]> {
    return request("GET", "properties", PagedContentSchema(MediaPropertyModel), { include_public: true })
      .then(response => response.contents);
  },

  getProperty(propertyId: string): Promise<MediaPropertyModel> {
    return request("GET", `properties/${propertyId}`, MediaPropertyModel, {
      // TODO: TEMP. PUT THIS SOMEWHERE ELSE.
      //  This token is pre-generated for the "main" network
      authorization: "eyJxc3BhY2VfaWQiOiAiaXNwYzJSVW9SZTllUjJ2MzNIQVJRVVZTcDFyWVh6dzEifQ==",
    });
  }
};

async function request<R>(method: "GET" | "POST", path: string, resultParser: ZodType<R, any, any>, query: any = {}) {
  return fabricConfigStore.promiseConfig().then(async config => {
    const url = new URL(fabricConfigStore.config!.authdBaseUrl);
    url.pathname += "/mw/" + path;
    Object.keys(query).forEach((key) => {
      url.searchParams.set(key, query[key]);
    });
    const response: Response = await fetch(url, { method });
    const json = await response.json();
    return resultParser.parse(json);
  });
}
