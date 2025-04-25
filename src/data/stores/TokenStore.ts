import { action, makeAutoObservable, runInAction } from "mobx";
import { fabricConfigStore } from "@/data/stores/index";
import Env from "@/data/Env";
import { ActivationDataModel } from "@/data/models/ActivationDataModel";

export class TokenStore {
  fabricToken?: string = undefined;
  clusterToken?: string = undefined;
  walletAddress?: string = undefined;
  userEmail?: string = undefined;

  activationData?: ActivationDataModel = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Clears current activation data and fetches a new one.
   */
  async refreshActivationData() {
    console.log("refreshing activation data");
    this.activationData = undefined;
    return fabricConfigStore.promiseConfig()
      .then(config => fetch(
        `${config.authdBaseUrl}/wlt/login/redirect/metamask`,
        {
          method: "POST",
          body: JSON.stringify({
            op: "create",
            dest: `${Env.walletUrl}?action=login&mode=login&response=code&source=code#/login`
          })
        })
      )
      .then(response => response.json())
      .then(json => ActivationDataModel.parseAsync(json))
      .then(action(activationData => {
        runInAction(() => {
          this.activationData = activationData;
          console.log("saving new data================", this.activationData);
        });
      }));
  }

  async checkToken(activationData: ActivationDataModel): Promise<any> {
    console.log("checking token", activationData);
    return fabricConfigStore.promiseConfig()
      .then(action(config => fetch(`${config.authdBaseUrl}/wlt/login/redirect/metamask/${activationData.id}/${activationData.passcode}`)))
      .then(async response => {
        if (response.ok) {
          const result = await response.json();
          runInAction(() => {
            const payload = JSON.parse(result.payload);
            this.fabricToken = payload.token;
            this.clusterToken = payload.clusterToken;
            this.walletAddress = payload.addr;
            this.userEmail = payload.email;
            // Clear activation data, we no longer need it.
            this.activationData = undefined;
          });
          return true;
        } else {
          return false;
        }
      });
  }

  get isLoggedIn(): boolean {
    return !!this.fabricToken;
  }
}
