import { useEffect, useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { autorun } from "mobx";
import Log from "@/utils/Log";
import { tokenStore } from "@/data/stores";
import { EluvioPlayerParameters, InitializeEluvioPlayer } from "@eluvio/elv-player-js/lib/index";
import { InteractionManager as Hls } from "react-native-web";

/**
 * @returns {number | undefined} - Memoized bitrate limit in bytes, or undefined if there is no limit.
 */
const useBitrateLimit = () => {
  return useMemo(() => {
    const ua = window.navigator.userAgent;
    // Captures "Xbox One", "Xbox Series S", "Xbox Series X"
    if (ua.includes("Xbox")) {
      return 9500;
    } else {
      return undefined;
    }
  }, [window.navigator.userAgent]);
};

/**
 * By default, this component captures key events from the window and forwards them to the player.
 * If it's not the only component on screen when [forwardWindowKeyEvents] is true, we might get some odd behavior.
 */
const Video = observer(({objectId}) => {
  const targetRef = useRef();

  // TODO(Stav): this was used for some xbox oddity. Figure out if we need it still.
  // useEffect(() => {
  //   const forwardKeyEventToPlayer = (event) => {
  //     if (forwardWindowKeyEvents && targetRef.current && !event.defaultPrevented && event.srcElement === window) {
  //       Log.d("Forwarding key event from window to player", event);
  //       targetRef.current.dispatchEvent(new event.constructor(event.type, event));
  //       event.preventDefault();
  //       event.stopPropagation();
  //     }
  //   };
  //   window.addEventListener('keydown', forwardKeyEventToPlayer);
  //   return () => {
  //     window.removeEventListener('keydown', forwardKeyEventToPlayer);
  //   };
  // }, []);

  const bitrateLimitBytes = useBitrateLimit();

  useEffect(() => {
    if (!targetRef || !targetRef.current) {
      return;
    }
    let playerPromise;
    const disposer = autorun(() => {
      playerPromise = InitializeEluvioPlayer(
        targetRef.current,
        {
          clientOptions: {
            network: EluvioPlayerParameters.networks.MAIN,
            staticToken: tokenStore.fabricToken,
          },
          sourceOptions: {
            playoutParameters: {
              objectId, // Let player figure out the latest version hash
            }
          },
          playerOptions: {
            ui: EluvioPlayerParameters.ui.TV,
            watermark: EluvioPlayerParameters.watermark.OFF,
            autoplay: EluvioPlayerParameters.autoplay.ON,
            keyboardControls: EluvioPlayerParameters.keyboardControls.SPATIAL_NAVIGATION,
            controls: EluvioPlayerParameters.controls.AUTO_HIDE,
            allowCasting: EluvioPlayerParameters.allowCasting.OFF,
            playerCallback: ({hlsPlayer, dashPlayer}) => {
              if (bitrateLimitBytes && dashPlayer) {
                Log.d("Updating bitrate limit on Dash", bitrateLimitBytes);
                dashPlayer.updateSettings({
                  streaming: {
                    abr: {
                      maxBitrate: {
                        video: bitrateLimitBytes,
                      },
                    }
                  }
                });
              }
              if (bitrateLimitBytes && hlsPlayer) {
                Log.d("Updating bitrate limit on HLS", bitrateLimitBytes);
                hlsPlayer.once(Hls.Events.LEVEL_LOADED, () => {
                  // Remove all levels above 9.5Mbps, xbox S can't handle it
                  // TODO: Make this dynamic based on device.
                  hlsPlayer.levels
                    .map((level, index) => {
                      return {
                        bitrate: level.bitrate,
                        index
                      };
                    })
                    .filter((level) => level.bitrate > (bitrateLimitBytes * 1000))
                    .forEach((level) => {
                      Log.d("Removing quality option that is too high", level);
                      hlsPlayer.removeLevel(level.index);
                    });
                });
              }
            },
          },
        }
      );
    }, {delay: 50});

    return async () => {
      disposer();

      if (!playerPromise) {
        return;
      }

      const player = await playerPromise;
      player.Destroy();
    };
  }, [targetRef, objectId]);

  return <div ref={targetRef} style={{width: "100%", height: "100%", backgroundColor: "black"}} />;
});

export default Video;
