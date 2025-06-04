import { makeAutoObservable, runInAction } from "mobx";
import { MediaPropertyStore } from "@/data/stores/MediaPropertyStore";
import { FabricConfigStore } from "@/data/stores/FabricConfigStore";
import { TokenStore } from "@/data/stores/TokenStore";
import { Dict } from "@/utils/Dict";
import Log from "@/utils/Log";

export class RootStore {
  mediaPropertyStore: MediaPropertyStore;
  fabricConfigStore: FabricConfigStore;
  tokenStore: TokenStore;

  // Cache of shortened URLs
  shortURLs: Dict<string> = {};

  constructor() {
    makeAutoObservable(this);
    this.fabricConfigStore = new FabricConfigStore();
    this.mediaPropertyStore = new MediaPropertyStore();
    this.tokenStore = new TokenStore();
  }

  async CreateShortURL(url: string): Promise<string | null> {
    try {
      // Normalize URL
      url = new URL(url).toString();
      const cache = runInAction(() => this.shortURLs[url]);
      if (!cache) {
        const { url_mapping } = await (await fetch("https://elv.lv/tiny/create", { method: "POST", body: url })).json();
        runInAction(() => this.shortURLs[url] = url_mapping.shortened_url);
        return url_mapping.shortened_url;
      } else {
        return cache;
      }
    } catch (error) {
      Log.e("Error creating short URL", error);
      return null;
    }
  }
}
