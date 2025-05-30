enum Level {
  VERBOSE = "VERBOSE",
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR"
}

class Log {
  v(message: string, data?: any) {
    this.log(Level.VERBOSE, message, data);
  }

  d(message: string, data?: any) {
    this.log(Level.DEBUG, message, data);
  }

  i(message: string, data?: any) {
    this.log(Level.INFO, message, data);
  }

  w(message: string, data?: any) {
    this.log(Level.WARN, message, data);
  }

  e(message: string, data?: any) {
    this.log(Level.ERROR, message, data);
  }

  private log(level: Level, message: string, data?: any) {
    let color;
    switch (level) {
      case Level.VERBOSE:
        color = "#BBBBBB";
        break;
      case Level.DEBUG:
        color = "#299999";
        break;
      case Level.INFO:
        color = "#62C023";
        break;
      case Level.WARN:
        color = "#BBB529";
        break;
      case Level.ERROR:
        color = "#FF6B68";
        break;
    }
    color = `color:${color}`;
    message = `%c${message}`;
    data = data || "";
    if (level === Level.ERROR) {
      console.error(message, color, data);
    } else {
      console.log(message, color, data);
    }
  }
}

export default new Log();
