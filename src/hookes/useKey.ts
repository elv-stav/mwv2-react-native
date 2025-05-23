import { useEffect } from 'react';
import { SupportedKeys } from "@/remote-control/SupportedKeys";
import RemoteControlManager from "@/remote-control/RemoteControlManager";

/**
 * A convenient hook to listen to a key and react to it
 *
 * @example useKey(SupportedKeys.Back, () => { console.log('pressed back!') })
 */
export const useKey = (key: SupportedKeys, callback: (pressedKey: SupportedKeys) => boolean) => {
  useEffect(() => {
    const remoteControlListener = (actualKey: SupportedKeys) => {
      if (actualKey !== key) return false;
      return callback(key);
    };
    RemoteControlManager.addKeydownListener(remoteControlListener);
    return () => RemoteControlManager.removeKeydownListener(remoteControlListener);
  }, [key, callback]);
};
