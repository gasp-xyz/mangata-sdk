import { it, expect, afterAll } from "vitest";
import { BN } from "@polkadot/util";
import { instance } from "./instance";
import { Reserve } from "../src";
import { fromBN } from "../src/utils/bnUtility";

it("should calculate buy price for 1 KSM", async () => {
  const expectedPrice = "31428.127543982131597807";
  const ksmReserve = new BN("10548504882988569");
  const mgxReserve = new BN("330493863747139058140562661");
  const oneKSM = new BN("1000000000000");
  const args: Reserve = {
    inputReserve: mgxReserve,
    outputReserve: ksmReserve,
    amount: oneKSM
  };
  const buyPrice = await instance.rpc.calculateBuyPrice(args);
  const actualprice = fromBN(buyPrice);
  expect(actualprice).toEqual(expectedPrice);
});

it("should calculate sell price for 1 KSM", async () => {
  const expectedPrice = "31233.927991162450224002";
  const ksmReserve = new BN("10548504882988569");
  const mgxReserve = new BN("330493863747139058140562661");
  const oneKSM = new BN("1000000000000");
  const args: Reserve = {
    inputReserve: ksmReserve,
    outputReserve: mgxReserve,
    amount: oneKSM
  };
  const sellPrice = await instance.rpc.calculateSellPrice(args);
  const actualprice = fromBN(sellPrice);
  expect(actualprice).toEqual(expectedPrice);
});
