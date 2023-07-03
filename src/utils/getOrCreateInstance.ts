import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "./options";

interface MangataInstanceMap {
  [key: string]: Promise<ApiPromise>;
}

const instanceMap: MangataInstanceMap = {};

export const getOrCreateInstance = (urls: string[]): Promise<ApiPromise> => {
  /**
   * Generate a unique key for the given array of URLs.
   * Sort the URLs alphabetically before creating the key.
   * We want to ensure that the getInstance function only creates one instance
   * for any given array of URLs, regardless of the order of the URLs in the array
   */
  const key = JSON.stringify(urls.sort());

  if (!instanceMap[key]) {
    const provider = new WsProvider(urls);
    instanceMap[key] = ApiPromise.create(
      options({
        provider,
        throwOnConnect: true,
        throwOnUnknown: true,
        noInitWarn: true
      })
    );
  }

  return instanceMap[key];
};
