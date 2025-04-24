import { z } from 'zod';
import { ImageURISource } from "react-native/Libraries/Image/ImageSource";

export const AssetLinkModel = z.object({
  ".": z.object({ container: z.string() }),
  "/": z.string()
}).transform(obj => ({
  ...obj,
  get path(): string {
    if (obj["/"].startsWith("/qfab/")) {
      const filePath = obj["/"].slice("/qfab".length); //TODO: url encode?
      return `q/${filePath}`;
    } else {
      const hash = obj["."].container;
      let filePath = obj["/"];
      if (filePath.startsWith("./")) {
        filePath = filePath.slice("./".length);
      }
      return `q/${hash}/${filePath}`;
    }
  }
})).transform(obj => ({
  ...obj,
  url(baseUrl: string = "https://host-76-74-28-232.contentfabric.io/"): string | undefined {
    if (!obj.path) return undefined;
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    return `${baseUrl}${obj.path}`;
  }
})).transform(obj => ({
  ...obj,
  urlSource(baseUrl: string | undefined = undefined): ImageURISource | undefined {
    const uri = obj.url(baseUrl);
    if (!uri) return undefined;
    return { uri };
  }
}));

export type AssetLinkModel = z.infer<typeof AssetLinkModel>;
