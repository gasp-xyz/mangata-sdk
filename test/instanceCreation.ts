import { Mangata } from "../src/Mangata";

const uri = process.env.API_URL || "ws://127.0.0.1:9947";

export const instance = Mangata.getInstance([uri]);
export const SUDO_USER_NAME = process.env.TEST_SUDO_NAME || "//Alice";
