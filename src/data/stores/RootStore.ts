import { makeAutoObservable } from "mobx";
import { MediaPropertyStore } from "@/data/stores/MediaPropertyStore";
import { FabricConfigStore } from "@/data/stores/FabricConfigStore";
import { TokenStore } from "@/data/stores/TokenStore";

export class RootStore {
  mediaPropertyStore: MediaPropertyStore;
  fabricConfigStore: FabricConfigStore;
  tokenStore: TokenStore;

  constructor() {
    makeAutoObservable(this);
    this.fabricConfigStore = new FabricConfigStore();
    this.mediaPropertyStore = new MediaPropertyStore();
    this.tokenStore = new TokenStore();
  }
}
