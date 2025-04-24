import { action, flow, makeAutoObservable, runInAction } from "mobx";
import { MediaWalletApi } from "@/data/api/MediaWalletApi";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";
import { MediaPageModel } from "@/data/models/MediaPageModel";
import { PermissionResolver } from "@/data/helpers/PermissionResolver";
import { objectOutputType, RecordType, ZodBoolean } from "zod";
import { ZodType } from "zod/lib/types";

export class MediaPropertyStore {

  // m.top.properties is an array of properties that show up on the Discover page.
  // m.propertyMap is a cache of ALL properties keyed by their IDs.
  // This includes properties individually fetched (e.g. from links or subproperty switching)
  properties = new Map<string, MediaPropertyModel>();

  // Keys are propertyId, and values are a map of PageId->Page object
  pages = new Map<string, Map<string, MediaPageModel>>();

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProperties() {
    const properties = await MediaWalletApi.getProperties();
    if (!properties) {
      return;
    }

    const propertyMap = new Map<string, MediaPropertyModel>();
    runInAction(() => {
      properties.forEach((property) => {
        this._processProperty(property, propertyMap);
      });
      this.properties = propertyMap;
    });
  };

  _processProperty = action((property: MediaPropertyModel, propertyMap: Map<string, MediaPropertyModel> = this.properties) => {
    propertyMap.set(property.id, property);
    const pages = this.pages.get(property.id) || new Map<string, MediaPageModel>();
    pages.set(property.main_page.id, property.main_page);
    this.pages.set(property.id, pages);
    const a: RecordType<string, objectOutputType<{
      authorized: ZodBoolean
    }, ZodType<any, any, any>, "strip">> | null | undefined = property.permission_auth_state;
    PermissionResolver.ResolvePermissions({
      item: property,
      parentPermissions: null,
      permissionStates: property.permission_auth_state
    });

    propertyMap.set(property.id, property);
  });
}
