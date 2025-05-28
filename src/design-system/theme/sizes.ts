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
    contentPadding: scaledPixels(80),
    card: {
      height: scaledPixels(280)
    },
    title: {
      height: scaledPixels(100),
    },
    row: {
      gap: scaledPixels(20),
      paddingVertical: scaledPixels(110),
      get height() {
        return (sizes.carousel.card.height * scale.focused) + sizes.carousel.title.height;
      }
    }
  },
  menu: {
    open: scaledPixels(400),
    closed: scaledPixels(100),
    icon: scaledPixels(20),
  },
};
