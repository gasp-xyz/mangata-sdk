/* eslint-disable no-console */
import { BN } from "@polkadot/util";
import { instance } from "./instanceCreation";

it.concurrent("should calculate buy price", async () => {
  const buyPrice = await instance.calculateBuyPrice(
    new BN(50000),
    new BN(25000),
    new BN(1000)
  );
  expect(buyPrice.toNumber()).toEqual(2090);
});

it.concurrent("should calculate sell price", async () => {
  const buyPrice = await instance.calculateSellPrice(
    new BN(50000),
    new BN(25000),
    new BN(1000)
  );
  expect(buyPrice.toNumber()).toEqual(488);
});

afterAll(async () => {
  await instance.disconnect();
});
