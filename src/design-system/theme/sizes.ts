import { scaledPixels } from "@/design-system/helpers/scaledPixels";
import { scale } from "@/design-system/theme/scale";

export const sizes = {
  program: {
    landscape: { width: scaledPixels(450), height: scaledPixels(200) },
    portrait: { width: scaledPixels(200), height: scaledPixels(250) },
    long: { width: scaledPixels(416), height: scaledPixels(250) },
  },
  propertyCard: {
    width: scaledPixels(306),
    height: scaledPixels(450),
    gap: scaledPixels(22),
  },
  carousel: {
    card: {
      height: scaledPixels(280)
    },
    title: {
      height: scaledPixels(32),
    },
    row: {
      gap: scaledPixels(20),
      get height() {
        return (sizes.carousel.card.height + this.gap + sizes.carousel.title.height) * scale.focused;
      }
    }
  },
  menu: {
    open: scaledPixels(400),
    closed: scaledPixels(100),
    icon: scaledPixels(20),
  },
};
