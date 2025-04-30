import { z } from 'zod';
import { ImageURISource } from "react-native/Libraries/Image/ImageSource";
import { fabricConfigStore } from "@/data/stores";

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
  url(height?: number): string | undefined {
    let baseUrl: string = fabricConfigStore.config?.fabricBaseUrl!;
    if (!obj.path) return undefined;
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    const heightParam = height ? `?height=${Math.round(height)}` : "";
    return `${baseUrl}${obj.path}${heightParam}`;
  }
})).transform(obj => ({
  ...obj,
  urlSource(height?: number): ImageURISource | undefined {
    const uri = obj.url(height);
    if (!uri) return undefined;
    return { uri };
  }
}));

export type AssetLinkModel = z.infer<typeof AssetLinkModel>;
