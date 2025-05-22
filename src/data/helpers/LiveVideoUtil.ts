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
      month: "numeric",
      day: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
    return `${dateStr} at ${timeStr}`;
  },

  remainingTimeString(media: MediaItemModel): string {
    const startTime = Date.parse(media.start_time || "");
    if (!startTime) return "";

    const remainingTimeSeconds = (startTime - Date.now()) / 1000;
    if (remainingTimeSeconds <= 0) {
      // Short circuit a time that has already started
      return "0 Seconds";
    }

    const { days, hours, minutes, seconds } = getTimeRemaining(remainingTimeSeconds);
    const hasDays = days != 0;
    const hasHours = hours != 0;
    const hasMinutes = minutes != 0;
    const hasSeconds = seconds != 0;
    let result = "";
    let components = 0;
    if (hasDays) {
      result += (days);
      if (days == 1) {
        result += (" Day");
      } else {
        result += (" Days");
      }
      components++;
    }
    if (hasHours || (hasDays && (hasMinutes || hasSeconds))) {
      if (components++ > 0) result += (", ");
      result += (hours);
      if (hours == 1) {
        result += (" Hour");
      } else {
        result += (" Hours");
      }
    }
    if (hasMinutes || (hasSeconds && (hasHours || hasDays))) {
      if (components++ > 0) result += (", ");
      result += (minutes);
      if (minutes == 1) {
        result += (" Minute");
      } else {
        result += (" Minutes");
      }
    }
    // Always show Seconds
    if (components > 0) result += (", ");
    result += (seconds);
    if (seconds == 1) {
      result += (" Second");
    } else {
      result += (" Seconds");
    }
    return result;
  }
};

function getTimeRemaining(totalSeconds: number) {
  const seconds = Math.floor((totalSeconds) % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds
  };
}
