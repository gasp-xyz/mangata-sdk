import { MangataHelpers, signTx } from "../src";
import { instance, SUDO_USER_NAME } from "./instanceCreation";
import { BN } from "@polkadot/util";
import { getAssetsInfoMapWithIds } from "../src/utils";

describe("Rewards", () => {
  it("user should be able to claim rewards and check whether pool is promoted", async () => {
    const api = await instance.getApi();
    if (api.isConnected) {
      await instance.waitForNewBlock(2);
      const keyring = MangataHelpers.createKeyring("sr25519");
      const sudoUser =
        MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(
          keyring,
          SUDO_USER_NAME
        );

      const sudoNonce1 = await instance.getNonce(sudoUser.address);
      await signTx(
        api,
        api.tx.sudo.sudo(
          api.tx.tokens.mint(
            "0",
            sudoUser.address,
            new BN(new BN(10).pow(new BN(18)))
          )
        ),
        sudoUser,
        {
          nonce: sudoNonce1
        }
      );

      await instance.waitForNewBlock(2);

      const sudoNonce2 = await instance.getNonce(sudoUser.address);
      await signTx(
        api,
        api.tx.sudo.sudo(
          api.tx.tokens.mint(
            "4",
            sudoUser.address,
            new BN(new BN(10).pow(new BN(18)))
          )
        ),
        sudoUser,
        {
          nonce: sudoNonce2
        }
      );
      await instance.waitForNewBlock(2);
      await instance.createPool(
        sudoUser,
        "0",
        new BN(25000),
        "4",
        new BN(50000)
      );
      await instance.waitForNewBlock(2);

      await signTx(
        api,
        api.tx.sudo.sudo(api.tx.xyk.promotePool("5")),
        sudoUser
      );

      await instance.waitForNewBlock(10);

      await instance.claimRewards(sudoUser, "5", new BN(5000), {
        extrinsicStatus: (result) => {
          expect(result[0].method).toEqual("ExtrinsicSuccess");
        }
      });

      const pool = await instance.getPool("5");
      expect(pool.isPromoted).toBeTruthy();
    }
  });
});

afterAll(async () => {
  await instance.disconnect();
});
