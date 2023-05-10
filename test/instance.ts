import { Mangata } from "../src";

const uri = process.env.API_URL || "ws://127.0.0.1:9947";

export const instance = Mangata.instance([
  "wss://kusama-archive.mangata.online"
]);
export const SUDO_USER_NAME = process.env.TEST_SUDO_NAME || "";
