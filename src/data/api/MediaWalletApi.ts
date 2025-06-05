import { fabricConfigStore } from "@/data/stores";
import { ZodType } from "zod/lib/types";
import { PagedContentSchema } from "@/data/models/PagedContentModel";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";
import { MediaPageModel } from "@/data/models/MediaPageModel";
import { MediaSectionModel } from "@/data/models/MediaSectionModel";
import makeAuthServiceRequest from "@/data/api/ElvHttp";
import { FetchResponse } from "expo/build/winter/fetch/FetchResponse";
import { MediaItemModel } from "@/data/models/MediaItemModel";

export const MediaWalletApi = {
  async getProperties(): Promise<MediaPropertyModel[]> {
    return request("GET", "properties", PagedContentSchema(MediaPropertyModel), { include_public: true })
      .then(response => response.contents);
  },

  getProperty(propertyId: string): Promise<MediaPropertyModel> {
    return request("GET", `properties/${propertyId}`, MediaPropertyModel);
  },

  getPage(propertyId: string, pageId: string): Promise<MediaPageModel> {
    return request("GET", `properties/${propertyId}/pages/${pageId}`, MediaPageModel);
  },

  async getSections(propertyId: string, sectionIds: string[]): Promise<MediaSectionModel[]> {
    return request("POST",
      `properties/${propertyId}/sections`,
      PagedContentSchema(MediaSectionModel),
      { resolve_subsections: true },
      JSON.stringify(sectionIds),
    ).then(response => response.contents);
  },

  async Search(propertyId: string, searchTerm: string): Promise<MediaSectionModel[]> {
    return request("POST",
      `properties/${propertyId}/search`,
      PagedContentSchema(MediaSectionModel),
      { limit: 30 },
      JSON.stringify({ search_term: searchTerm })
    ).then(response => response.contents);
  },

  async GetMediaItems(propertyId: string, mediaItemIds: string[]): Promise<MediaItemModel[]> {
    return request("POST",
      `properties/${propertyId}/media_items`,
      PagedContentSchema(MediaItemModel),
      {},
      JSON.stringify(mediaItemIds)
    ).then(response => response.contents);
  },
};

async function request<R>(method: "GET" | "POST", path: string, resultParser: ZodType<R, any, any>, query: any = {}, body?: BodyInit) {
  return fabricConfigStore.promiseConfig().then(async config => {
    const url = new URL(fabricConfigStore.config!.authdBaseUrl);
    url.pathname += "/mw/" + path;
    Object.keys(query).forEach((key) => {
      url.searchParams.set(key, query[key]);
    });
    const response: FetchResponse = await makeAuthServiceRequest(url.toString(), { method, body });
    const json = await response.json();
    return resultParser.parse(json);
  });
}
