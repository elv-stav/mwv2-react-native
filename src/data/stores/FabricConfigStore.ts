import { makeAutoObservable } from "mobx";
import { FabricConfigModel } from "@/data/models/FabricConfigModel";
import waitFor from "@/data/helpers/waitFor";
import Env from "@/data/Env";
import Log from "@/utils/Log";

export class FabricConfigStore {
  config: FabricConfigModel | undefined;

  constructor() {
    makeAutoObservable(this);

    this.fetchConfig();
  }

  fetchConfig() {
    fetch(Env.configUrl)
      .then(response => response.json())
      .then(json => FabricConfigModel.parse(json))
      .then(config => {
        Log.v("New config fetched", config);
        this.config = config;
        setTimeout(() => this.fetchConfig(), 3 * 60 * 1000);
      })
      .catch((reason) => {
        Log.e("Failed to fetch config", reason);
      });
  }

  promiseConfig(): Promise<FabricConfigModel> {
    return waitFor(() => this.config);
  }
}
