import { Mangata } from '../src';

describe("test Creation of Mangata Instance", () => {
    it("should return the instance", async () => {
        const m = Mangata.getInstance("wss://rpc.polkadot.io")
        const chain = await m.getChain()
        expect(chain.toHuman()).toBe("Polkadot");
    });
});

afterAll(() => setTimeout(() => process.exit(), 1000))