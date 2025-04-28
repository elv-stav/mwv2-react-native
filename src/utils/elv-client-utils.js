/** Stripped down version of Utils from elv-client-js */
if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = require("buffer/").Buffer;
}
const bs58 = require("bs58");
const URI = require("urijs");
const Pako = require("pako");

/**
 * @namespace
 * @description This is a utility namespace mostly containing functions for managing
 * multiformat type conversions.
 *
 * Utils can be imported separately from the client:
 *
 * `const Utils = require("@eluvio/elv-client-js/src/Utils)`
 *
 * or
 *
 * `import Utils from "@eluvio/elv-client-js/src/Utils"`
 *
 *
 * It can be accessed from ElvClient and FrameClient as `client.utils`
 */
const Utils = {
  name: "Utils",

  /**
   * Convert address to normalized form - lower case with "0x" prefix
   *
   * @param {string} address - Address to format
   *
   * @returns {string} - Formatted address
   */
  FormatAddress: (address) => {
    if (!address || typeof address !== "string") {
      return "";
    }

    address = address.trim();

    if (!address.startsWith("0x")) {
      address = "0x" + address;
    }
    return address.toLowerCase();
  },

  /**
   * Formats a signature into multi-sig
   *
   * @param {string} sig - Hex representation of signature
   *
   * @returns {string} - Multi-sig string representation of signature
   */
  FormatSignature: (sig) => {
    sig = sig.replace("0x", "");
    return "ES256K_" + bs58.encode(Buffer.from(sig, "hex"));
  },

  /**
   * Decode the specified signed token into its component parts
   *
   * @param {string} token - The token to decode
   *
   * @return {Object} - Components of the signed token
   */
  DecodeSignedToken: (token) => {
    const decodedToken = Utils.FromB58(token.slice(6));
    const signature = `0x${decodedToken.slice(0, 65).toString("hex")}`;

    let payload = JSON.parse(Buffer.from(Pako.inflateRaw(decodedToken.slice(65))).toString("utf-8"));
    payload.adr = Utils.FormatAddress(`0x${Buffer.from(payload.adr, "base64").toString("hex")}`);

    return {
      payload,
      signature
    };
  },

  /**
   * Convert contract address to multiformat hash
   *
   * @param {string} address - Address of contract
   * @param {boolean} key - Whether or not the first param is a public key. Defaults to address type
   *
   * @returns {string} - Hash of contract address
   */
  AddressToHash: (address, key = false) => {
    address = address.replace(key ? "0x04" : "0x", "");
    return bs58.encode(Buffer.from(address, "hex"));
  },

  /**
   * Convert any content fabric ID to the corresponding contract address
   *
   * @param {string} hash - Hash to convert to address
   * @param {boolean} key - Whether or not the first param is a key. Defaults to address type
   *
   * @returns {string} - Contract address of item
   */
  HashToAddress: (hash, key = false) => {
    hash = key ? hash : hash.substr(4);
    return Utils.FormatAddress((key ? "0x04" : "0x") + bs58.decode(hash).toString("hex"));
  },

  BufferToArrayBuffer: (buffer) => {
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  },

  FromHex: str => {
    str = str.replace(/^0x/, "");
    return Buffer.from(str, "hex").toString();
  },

  B64: (str, encoding = "utf-8") => {
    return Buffer.from(str, encoding).toString("base64");
  },

  FromB64: str => {
    return Buffer.from(str, "base64").toString("utf-8");
  },

  FromB64URL: str => {
    str = str.replace(/-/g, "+").replace(/_/g, "/");

    const pad = str.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error("InvalidLengthError: Input base64url string is the wrong length to determine padding");
      }

      str += new Array(5 - pad).join("=");
    }

    return Utils.FromB64(str);
  },

  B58: arr => {
    return bs58.encode(Buffer.from(arr));
  },

  FromB58: str => {
    return bs58.decode(str);
  },

  FromB58ToStr: str => {
    return new TextDecoder().decode(Utils.FromB58(str));
  },

  /**
   * Decode the given fabric authorization token
   *
   * @param {string} token - The authorization token to decode
   * @return {Object} - Token Info: {qspace_id, qlib_id*, addr, tx_id*, afgh_pk*, signature}
   */
  DecodeAuthorizationToken: token => {
    token = decodeURIComponent(token);

    let [info, signature] = token.split(".");

    info = JSON.parse(Utils.FromB64(info));

    return {
      ...info,
      signature
    };
  },

  /**
   * Interprets an http response body obtained from an http call as JSON and returns result of parsing it.
   *
   * @param {Promise} response - An http response from node-fetch
   * @param {boolean=} debug - Whether or not to log the body
   * @param {Function} logFn - Log function to use if debug is truthy
   * @return {*} - Result of parsing response body as JSON
   */
  ResponseToJson: async (response, debug = false, logFn) => {
    return await Utils.ResponseToFormat("json", response, debug, logFn);
  },

  /**
   * Interprets an http response body obtained from an http call as a requested format and returns result of converting/formatting.
   *
   * @param {string} format - The format to use when interpreting response body (e.g. "json", "text" et. al.)
   * @param {Promise} response - An http response from node-fetch
   * @param {boolean=} debug - Whether or not to log a debug statement containing the body (ignored for formats other than "json" and "text")
   * @param {Function} logFn - Log function to use if debug is truthy
   * @return {*} - Result of converting response body into the requested format
   */
  ResponseToFormat: async (format, response, debug = false, logFn) => {
    response = await response;
    let formattedBody;

    switch (format.toLowerCase()) {
      case "json":
        formattedBody = await response.json();
        if (debug) logFn(`response body: ${JSON.stringify(formattedBody, null, 2)}`);
        return formattedBody;
      case "text":
        formattedBody = await response.text();
        if (debug) logFn(`response body: ${formattedBody}`);
        return formattedBody;
      case "blob":
        return await response.blob();
      case "arraybuffer":
        return await response.arrayBuffer();
      case "formdata":
        return await response.formData();
      case "buffer":
        return await response.buffer();
      default:
        return response;
    }
  },

  /**
   * Resize the image file or link URL to the specified maximum height. Can also be used to remove
   * max height parameter(s) from a url if height is not specified.
   *
   * @param imageUrl - Url to an image file or link in the Fabric
   * @param {number=} height - The maximum height for the image to be scaled to.
   *
   * @returns {string} - The modified URL with the height parameter
   */
  ResizeImage({imageUrl, height}) {
    if (!imageUrl || (imageUrl && !imageUrl.startsWith("http"))) {
      return imageUrl;
    }

    imageUrl = URI(imageUrl)
      .removeSearch("height")
      .removeSearch("header-x_image_height");

    if (height && !isNaN(parseInt(height))) {
      imageUrl.addSearch("height", parseInt(height));
    }

    return imageUrl.toString();
  },

  PLATFORM_NODE: "node",
  PLATFORM_WEB: "web",
  PLATFORM_REACT_NATIVE: "react-native",

  Platform: () => {
    if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
      return Utils.PLATFORM_REACT_NATIVE;
    } else if (
      (typeof process !== "undefined") &&
      (typeof process.versions !== "undefined") &&
      (typeof process.versions.node !== "undefined")
    ) {
      return Utils.PLATFORM_NODE;
    } else {
      return Utils.PLATFORM_WEB;
    }
  },

  HLSJSSettings({profile = "default"} = {}) {
    const isSafari =
      typeof window !== "undefined" &&
      typeof window.navigator !== "undefined" &&
      /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);

    const defaultSettings = {
      "maxBufferHole": 2.2,
      "nudgeOffset": 0.2,
      "nudgeMaxRetry": 12,
      "highBufferWatchdogPeriod": 1
    };

    if (!isSafari && ["ull", "ultraLowLatency"].includes(profile)) {
      return {
        "lowLatencyMode": true,
        "liveSyncDuration": 4,
        "liveMaxLatencyDuration": 5,
        "liveDurationInfinity": false,
        "maxBufferLength": 8,
        "backBufferLength": 4,
        "highBufferWatchdogPeriod": 1
      };
    } else if (["ll", "lowLatency", "ull", "ultraLowLatency"].includes(profile)) {
      return {
        "lowLatencyMode": true,
        "liveSyncDuration": 5,
        "liveMaxLatencyDuration": isSafari ? 15 : 10,
        "liveDurationInfinity": false,
        "maxBufferLength": 5,
        "backBufferLength": 5,
        ...defaultSettings
      };
    } else {
      return defaultSettings;
    }
  },

  // Alias for HLSJSSettings
  LiveHLSJSSettings({lowLatency = false, ultraLowLatency = false}) {
    return Utils.HLSJSSettings({profile: ultraLowLatency ? "ull" : lowLatency ? "ll" : "default"});
  }
};

export default Utils;
