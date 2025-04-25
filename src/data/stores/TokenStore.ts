import { makeAutoObservable } from "mobx";

export class TokenStore {
  fabricToken?: string;
  idToken?: string;
  clusterToken?: string;
  walletAddress?: string;
  userEmail?: string;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn(): boolean {
    return !!this.fabricToken;
  }
}
