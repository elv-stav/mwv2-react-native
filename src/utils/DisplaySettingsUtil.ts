import { AspectRatio } from "@/utils/AspectRatio";
import { DisplaySettingsModel } from "@/data/models/DisplaySettingsModel";
import { AssetLinkModel } from "@/data/models/AssetLinkModel";

export type ThumbnailAndRatio = {
  thumbnail?: AssetLinkModel;
  aspectRatio?: number;
}

export const DisplaySettingsUtil = {
  getThumbnailAndRatio: function (display: DisplaySettingsModel): ThumbnailAndRatio {
    const forcedRatio = AspectRatio.fromString(display.aspect_ratio);
    let thumbnail;
    switch (forcedRatio) {
      case AspectRatio.SQUARE:
        thumbnail = display.thumbnail_image_square;
        break;
      case AspectRatio.POSTER:
        thumbnail = display.thumbnail_image_portrait;
        break;
      case AspectRatio.WIDE:
        thumbnail = display.thumbnail_image_landscape;
        break;
    }

    if (thumbnail) {
      // There's a thumbnail defined for the forced aspect ratio
      return {
        thumbnail: thumbnail,
        aspectRatio: forcedRatio ?? undefined
      };
    }

    // Aspect ratio is either not set, or the corresponding thumbnail is not defined.
    // Try to find the best thumbnail, but still use the forced ratio if it exists.
    if (display?.thumbnail_image_square) {
      return {
        thumbnail: display.thumbnail_image_square,
        aspectRatio: forcedRatio || AspectRatio.SQUARE
      };
    } else if (display?.thumbnail_image_portrait) {
      return {
        thumbnail: display.thumbnail_image_portrait,
        aspectRatio: forcedRatio || AspectRatio.POSTER
      };
    } else if (display?.thumbnail_image_landscape) {
      return {
        thumbnail: display.thumbnail_image_landscape,
        aspectRatio: forcedRatio || AspectRatio.WIDE
      };
    } else {
      return {};
    }
  }
};
