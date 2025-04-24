import { makeAutoObservable } from "mobx";
import { FabricConfigModel } from "@/data/models/FabricConfigModel";

export class FabricConfigStore {
  config: FabricConfigModel | undefined;

  constructor() {
    makeAutoObservable(this);

    this.fetchConfig();
  }

  fetchConfig() {
    fetch("https://main.net955305.contentfabric.io/config")
      .then(async response => FabricConfigModel.parse(await response.json()))
      .then(config => {
        console.log("New config fetched", config);
        this.config = config;
        setTimeout(() => this.fetchConfig(), 3 * 60 * 1000);
      });
  }

  promiseConfig(): Promise<FabricConfigModel> {
    const that = this;
    return new Promise<FabricConfigModel>((resolve) => {
      (function waitForConfig(){
        if (that.config) return resolve(that.config);
        setTimeout(waitForConfig, 30);
      })();
    })
  }
}