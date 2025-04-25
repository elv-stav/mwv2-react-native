import { makeAutoObservable } from "mobx";
import { FabricConfigModel } from "@/data/models/FabricConfigModel";
import waitFor from "@/data/helpers/waitFor";

export class FabricConfigStore {
  config: FabricConfigModel | undefined;

  constructor() {
    makeAutoObservable(this);

    this.fetchConfig();
  }

  fetchConfig() {
    fetch("https://main.net955305.contentfabric.io/config")
      .then(response => response.json())
      .then(json => FabricConfigModel.parse(json))
      .then(config => {
        console.log("New config fetched", config);
        this.config = config;
        setTimeout(() => this.fetchConfig(), 3 * 60 * 1000);
      })
      .catch((reason) => {
        console.error("Failed to fetch config", reason);
      });
  }

  promiseConfig(): Promise<FabricConfigModel> {
    return waitFor(() => this.config);
  }
}
