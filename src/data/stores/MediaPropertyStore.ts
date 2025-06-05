import { action, flow, makeAutoObservable, runInAction } from "mobx";
import { MediaWalletApi } from "@/data/api/MediaWalletApi";
import { MediaPropertyModel } from "@/data/models/MediaPropertyModel";
import { MediaPageModel } from "@/data/models/MediaPageModel";
import { PermissionResolver } from "@/data/helpers/PermissionResolver";
import useObservable from "@/data/helpers/useObservable";
import { Dict } from "@/utils/Dict";
import Log from "@/utils/Log";
import { mediaPropertyStore } from "@/data/stores/index";
import { MediaSectionModel } from "@/data/models/MediaSectionModel";
import { MediaItemModel } from "@/data/models/MediaItemModel";

/** Keys are propertyId, values are the corresponding MediaProperty */
type PropertyMap = Dict<MediaPropertyModel>
/** Keys are propertyId, and values are a map of PageId->Page object */
type PageMap = Dict<Dict<MediaPageModel>>

export class MediaPropertyStore {

  properties: PropertyMap = {};

  pages: PageMap = {};

  // Keys are "propertyId_pageId", and values are an array of Section objects.
  sectionsByPage: Dict<MediaSectionModel[]> = {};
  // Each section is cached by its own id
  sections: Dict<MediaSectionModel> = {};

  mediaItems: Dict<MediaItemModel> = {};

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
      Log.e("Error fetching property. Token expired?", e);
    }
  }

  /**
   * Observes the property and fetches a new copy from network, regardless of cache hit/miss.
   * @param propertyId
   */
  observeProperty(propertyId: string): MediaPropertyModel | undefined {
    return useObservable(
      this.properties[propertyId],
      () => this.fetchProperty(propertyId)
    );
  }

  getPageById = flow(function* ({ property, pageId }: {
    property?: MediaPropertyModel,
    pageId?: string,
  }) {
    if (!property || !pageId) {
      return;
    }
    const that = mediaPropertyStore;
    const cachedPage = that.pages[property.id]?.[pageId];
    if (cachedPage) {
      Log.d(`Page found in cache. Not fetching from network (id=${pageId})`);
      return cachedPage;
    }

    const page = yield MediaWalletApi.getPage(property.id, pageId);
    PermissionResolver.ResolvePermissions({
      item: page,
      parentPermissions: property.permissions?._content,
      permissionStates: property.permission_auth_state
    });
    that.pages[property.id] = that.pages[property.id] || {};
    that.pages[property.id][pageId] = page;
    return page;
  });

  async fetchSections(property: MediaPropertyModel, page: MediaPageModel) {
    const sections = await MediaWalletApi.getSections(property.id, page.layout.sections);
    runInAction(() => {
      sections.forEach((section) => {
        PermissionResolver.ResolvePermissions({
          item: section,
          parentPermissions: page.permissions?._content,
          permissionStates: property.permission_auth_state
        });
        this.sections[section.id] = section;
        // Also save subsections
        section.sections_resolved?.forEach(subsection => {
          this.sections[subsection.id] = subsection;
        });
      });

      this.sectionsByPage[`${property.id}_${page.id}`] = sections;
    });

    return sections;
  };

  async Search(property: MediaPropertyModel, searchTerm: string): Promise<MediaSectionModel[]> {
    const result = await MediaWalletApi.Search(property.id, searchTerm);

    runInAction(() => {

      // Search result sections will always have the same IDs (pscaSearchSection0/1/...),
      // but saving it here enables the View All functionality to just work.
      result.forEach(section => {
        this.sections[section.id] = section;
      });

      // Resolve permissions.
      PermissionResolver.ResolvePermissions({
        // Wrap with a fake "section container" to resolve permissions.
        item: { id: "fake_wrapper", sections_resolved: result },
        parentPermissions: property.permissions?._search,
        permissionStates: property.permission_auth_state
      });
    });

    return result;
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
