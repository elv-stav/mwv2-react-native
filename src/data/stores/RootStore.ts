import { makeAutoObservable } from "mobx";
import { MediaPropertyStore } from "@/data/stores/MediaPropertyStore";
import { FabricConfigStore } from "@/data/stores/FabricConfigStore";

export class RootStore {
  mediaPropertyStore: MediaPropertyStore;
  fabricConfigStore: FabricConfigStore;

  constructor() {
    makeAutoObservable(this);
    this.fabricConfigStore = new FabricConfigStore();
    this.mediaPropertyStore = new MediaPropertyStore();
  }
}
