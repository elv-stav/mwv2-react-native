import { action, makeAutoObservable, runInAction } from "mobx";
import { MediaWalletApi } from "@/data/api/MediaWalletApi";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";
import { MediaPageModel } from "@/data/models/MediaPageModel";
import { PermissionResolver } from "@/data/helpers/PermissionResolver";
import useObservable from "@/data/helpers/useObservable";
import { mediaPropertyStore } from "@/data/stores/index";

/** Keys are propertyId, values are the corresponding MediaProperty */
type PropertyMap = Record<string, MediaPropertyModel>
/** Keys are propertyId, and values are a map of PageId->Page object */
type PageMap = Record<string, Record<string, MediaPageModel>>

export class MediaPropertyStore {

  properties: PropertyMap = {};

  pages: PageMap = {};

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProperties() {
    const properties = await MediaWalletApi.getProperties();
    if (!properties) {
      return;
    }

    const propertyMap: PropertyMap = {};
    runInAction(() => {
      properties.forEach((property) => {
        this._processProperty(property, propertyMap);
      });
      this.properties = propertyMap;
    });
  };

  async fetchProperty(propertyId: string) {
    try {
      const property = await MediaWalletApi.getProperty(propertyId);
      runInAction(() => this._processProperty(property));
    } catch (e) {
      // rootStore.Log("Error fetching property. Token expired?", e);
    }
  }

  /**
   * Observes the property and fetches a new copy from network, regardless of cache hit/miss.
   * @param propertyId
   */
  observeProperty(propertyId: string): MediaPropertyModel | undefined {
    return useObservable(
      mediaPropertyStore.properties[propertyId],
      () => mediaPropertyStore.fetchProperty(propertyId).finally()
    );
  }

  _processProperty = action((property: MediaPropertyModel, propertyMap: PropertyMap = this.properties) => {
    propertyMap[property.id] = property;
    const pages = this.pages[property.id] || {};
    pages[property.main_page.id] = property.main_page;
    this.pages[property.id] = pages;
    PermissionResolver.ResolvePermissions({
      item: property,
      parentPermissions: null,
      permissionStates: property.permission_auth_state
    });

    propertyMap[property.id] = property;
  });
}
