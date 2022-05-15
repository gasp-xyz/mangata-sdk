import { Mangata } from "../index";

const uri = process.env.API_URL ? process.env.API_URL : "ws://127.0.0.1:9955";

export const instance = Mangata.getInstance(uri);
export const SUDO_USER_NAME = process.env.TEST_SUDO_NAME
  ? process.env.TEST_SUDO_NAME
  : "";
