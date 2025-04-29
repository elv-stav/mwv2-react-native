export const AspectRatio = {
  SQUARE: 1.0,
  WIDE: 16 / 9,
  POSTER: 2 / 3,

  fromString: function (ratioStr: string | undefined | null): (number | null) {
    switch (ratioStr) {
      case "Square":
        return AspectRatio.SQUARE;
      case "Landscape":
      case "Wide":
        return AspectRatio.WIDE;
      case "Poster":
      case "Portrait":
        return AspectRatio.POSTER;
      default:
        return null;
    }
  }
};
