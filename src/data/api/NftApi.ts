import { ZodType } from "zod/lib/types";
import { fabricConfigStore } from "@/data/stores";
import { FetchResponse } from "expo/build/winter/fetch/FetchResponse";
import makeAuthServiceRequest from "@/data/api/ElvHttp";
import { PagedContentSchema } from "@/data/models/PagedContentModel";
import { NftModel } from "@/data/models/nft/NftModel";
import { NftInfoModel } from "@/data/models/nft/NftInfo";

export const NftApi = {
  async getNfts(searchQuery?: string): Promise<NftModel[]> {
    return request("GET",
      "apigw/nfts",
      PagedContentSchema(NftModel),
      { name_like: searchQuery || "", limit: 100 }
    ).then(response => response.contents);
  },

  async getNftInfo(contractAddress: string): Promise<NftInfoModel> {
    return request("GET", `nft/info/${contractAddress}`, NftInfoModel);
  }
};


// Duplicated code from MediaWalletApi. maybe move to ElvHttp.ts?
async function request<R>(method: "GET" | "POST", path: string, resultParser: ZodType<R, any, any>, query: any = {}, body?: BodyInit) {
  return fabricConfigStore.promiseConfig().then(async config => {
    const url = new URL(config.authdBaseUrl);
    url.pathname += "/" + path;
    Object.keys(query).forEach((key) => {
      url.searchParams.set(key, query[key]);
    });
    const response: FetchResponse = await makeAuthServiceRequest(url.toString(), { method, body });
    const json = await response.json();
    return resultParser.parse(json);
  });
}
