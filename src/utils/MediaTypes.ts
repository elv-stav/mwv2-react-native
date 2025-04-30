export const MediaTypes = {
  AUDIO: "Audio",
  EBOOK: "Ebook",
  GALLERY: "Gallery",
  HTML: "HTML",
  IMAGE: "Image",
  LIVE: "Live",
  VIDEO: "Video",
  LIVE_VIDEO: "Live Video",

  isPlayable(type?: string): boolean {
    return type === this.VIDEO || type === this.LIVE_VIDEO;
  }
};
