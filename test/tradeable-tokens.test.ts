import { it, expect } from "vitest";
import { instance } from "./instance";

it("should calculate buy price for 1 KSM", async () => {
    const tokens = await instance.rpc.getTradeableTokens()
    const mangataToken = tokens.find(token => token.tokenId === "0")
    expect(mangataToken?.name).toEqual("Mangata");
    expect(mangataToken?.decimals).toEqual(18);
});