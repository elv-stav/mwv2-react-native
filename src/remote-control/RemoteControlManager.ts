import { SupportedKeys } from './SupportedKeys';
import { RemoteControlManagerInterface } from './RemoteControlManager.interface';
import CustomEventEmitter from './CustomEventEmitter';
import { Dict } from "@/utils/Dict";

const LONG_PRESS_DURATION = 500;

class RemoteControlManager implements RemoteControlManagerInterface {

  private static readonly keyMapping: Dict<SupportedKeys> = {
    ArrowRight: SupportedKeys.Right,
    ArrowLeft: SupportedKeys.Left,
    ArrowUp: SupportedKeys.Up,
    ArrowDown: SupportedKeys.Down,
    Enter: SupportedKeys.Enter,
    Backspace: SupportedKeys.Back,
    Escape: SupportedKeys.Back,
    // LG TVs use "GoBack" instead of "Backspace"
    GoBack: SupportedKeys.Back,
  };

  private static readonly arrowKeys = [
    SupportedKeys.Up, SupportedKeys.Down, SupportedKeys.Left, SupportedKeys.Right
  ];

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private eventEmitter = new CustomEventEmitter<{ keyDown: SupportedKeys }>();

  private isEnterKeyDown = false;
  private longEnterTimeout: NodeJS.Timeout | null = null;

  private handleLongEnter = () => {
    this.longEnterTimeout = setTimeout(() => {
      this.eventEmitter.emit('keyDown', SupportedKeys.LongEnter);
      this.longEnterTimeout = null;
    }, LONG_PRESS_DURATION);
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    const mappedKey = RemoteControlManager.keyMapping[event.code || event.key];
    if (!mappedKey) {
      return;
    }

    // Prevent extra scrolling on tizen
    if (RemoteControlManager.arrowKeys.includes(mappedKey)) {
      event.preventDefault();
    }

    if (mappedKey === SupportedKeys.Enter) {
      if (!this.isEnterKeyDown) {
        this.isEnterKeyDown = true;
        this.handleLongEnter();
      }
      return;
    }

    this.eventEmitter.emit('keyDown', mappedKey);
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    const mappedKey = {
      Enter: SupportedKeys.Enter,
    }[event.code];

    if (!mappedKey) {
      return;
    }

    if (mappedKey === SupportedKeys.Enter) {
      this.isEnterKeyDown = false;
      if (this.longEnterTimeout) {
        clearTimeout(this.longEnterTimeout);
        this.eventEmitter.emit('keyDown', mappedKey);
      }
    }
  };

  addKeydownListener = (listener: (event: SupportedKeys) => boolean) => {
    this.eventEmitter.on('keyDown', listener);
    return listener;
  };

  removeKeydownListener = (listener: (event: SupportedKeys) => boolean) => {
    this.eventEmitter.off('keyDown', listener);
  };

  emitKeyDown = (key: SupportedKeys) => {
    this.eventEmitter.emit('keyDown', key);
  };
}

export default new RemoteControlManager();
