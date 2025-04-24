import { action, configure } from "mobx";
import { RootStore } from "@/data/stores/RootStore";

configure({
  enforceActions: "always",
  observableRequiresReaction: true,
  disableErrorBoundaries: window.location.hostname === "localhost",
});

export const rootStore = action(() => new RootStore())();
export const fabricConfigStore = rootStore.fabricConfigStore;
export const mediaPropertyStore = rootStore.mediaPropertyStore;

declare global {
  interface Window {
    rootStore: RootStore;
  }
}

window.rootStore = rootStore;
