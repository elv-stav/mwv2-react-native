import { MediaItemModel } from "@/data/models/MediaItemModel";

export const LiveVideoUtil = {
  isEnded(media: MediaItemModel): boolean {
    if (!media.live_video) {
      return false;
    }

    const time = Date.parse(media.end_time || "") || Number.MAX_SAFE_INTEGER;
    return time <= Date.now();
  },

  isStreamStarted(media: MediaItemModel): boolean {
    if (!media.live_video) {
      return false;
    }

    const time = Date.parse(media.stream_start_time || "") || Number.MIN_SAFE_INTEGER;
    return time <= Date.now();
  },

  startDateTimeString(media: MediaItemModel): string {
    const date = media.start_time && new Date(media.start_time);
    if (!date) return "";

    const dateStr = date.toLocaleDateString("en-US", {
      month:"numeric",
      day: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
    return `${dateStr} at ${timeStr}`;
  },
};
