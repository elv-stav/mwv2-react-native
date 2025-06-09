import { action, makeAutoObservable } from "mobx";
import { Dict } from "@/utils/Dict";
import { NftModel } from "@/data/models/nft/NftModel";
import { NftApi } from "@/data/api/NftApi";

class NftStore {

  /** IDs are nft._uid, which include both the contract address and token ID. */
  nfts: Dict<NftModel> = {};

  constructor() {
    makeAutoObservable(this);
  }

  Search(searchQuery?: string) {
    return NftApi.getNfts(searchQuery)
      .then(action((data) => {
        if (!searchQuery) {
          this.nfts = {};
        }
        data.forEach((nft) => {
          this.nfts[nft._uid] = nft;
        });
        return data;
      }));
  }

  NftByUid(uid: string): NftModel | undefined {
    return this.nfts[uid];
  }
}

export default NftStore;
