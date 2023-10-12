import { Mangata, setLoggerOptions } from "../src";

setLoggerOptions({
  type: "pretty",
  hideLogPositionForProduction: false
});

const uri = process.env.API_URL || "ws://127.0.0.1:9946";

export const instance = Mangata.instance([uri]);
export const SUDO_USER_NAME = process.env.TEST_SUDO_NAME || "//Alice";
