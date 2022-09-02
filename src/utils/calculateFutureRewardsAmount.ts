import Big from "big.js";
import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";

const toPlainString = (num: string) => {
  // BN.js Throws from 1e+21 and above so using this make shift function
  return ("" + num).replace(
    /(-?)(\d*)\.?(\d+)e([+-]\d+)/,
    function (a, b, c, d, e) {
      return e < 0
        ? b + "0." + Array(1 - e - c.length).join("0") + c + d
        : b + c + d + Array(e - d.length + 1).join("0");
    }
  );
};

const calculateWork = (
  asymptote: BN,
  time: BN,
  lastCheckpoint: BN,
  cummulativeWorkInLastCheckpoint: BN,
  missingAtLastCheckpoint: BN
) => {
  const timePassed = time.sub(lastCheckpoint);
  const cummulativeWorkNewMaxPossible = new BN(asymptote).mul(timePassed);
  const base = new BN(missingAtLastCheckpoint).mul(new BN(106)).div(new BN(6));
  const precision = Big(10000);
  const qPow = Big(1.06).pow(timePassed.toNumber()).mul(precision).round(0, 0);
  const qPowCorrect = toPlainString(qPow.toString());
  const cummulativeMissingNew = new BN(base).sub(
    new BN(base).mul(new BN(precision.toString())).div(new BN(qPowCorrect))
  );
  const cummulativeWorkNew = new BN(cummulativeWorkNewMaxPossible).sub(
    cummulativeMissingNew
  );
  const workTotal = new BN(cummulativeWorkInLastCheckpoint).add(
    cummulativeWorkNew
  );

  return workTotal;
};

const getLiquidityMintingUser = async (
  address: string,
  liquditityTokenId: string,
  currentTime: BN,
  api: ApiPromise
) => {
  const [
    lastCheckpoint,
    cummulativeWorkInLastCheckpoint,
    missingAtLastCheckpoint
  ] = await api.query.xyk.liquidityMiningUser([address, liquditityTokenId]);

  if (
    new BN(lastCheckpoint.toString()).eq(new BN(0)) &&
    new BN(cummulativeWorkInLastCheckpoint.toString()).eq(new BN(0)) &&
    new BN(missingAtLastCheckpoint.toString()).eq(new BN(0))
  ) {
    return {
      lastCheckpoint: currentTime,
      cummulativeWorkInLastCheckpoint: Big(0),
      missingAtLastCheckpoint: Big(0)
    };
  } else {
    return {
      lastCheckpoint: Big(lastCheckpoint.toString()),
      cummulativeWorkInLastCheckpoint: Big(
        cummulativeWorkInLastCheckpoint.toString()
      ),
      missingAtLastCheckpoint: Big(missingAtLastCheckpoint.toString())
    };
  }
};

const getLiquidityMintingPool = async (
  liquditityTokenId: string,
  currentTime: BN,
  api: ApiPromise
) => {
  const [
    lastCheckpoint,
    cummulativeWorkInLastCheckpoint,
    missingAtLastCheckpoint
  ] = await api.query.xyk.liquidityMiningPool(liquditityTokenId);

  if (
    new BN(lastCheckpoint.toString()).eq(new BN(0)) &&
    new BN(cummulativeWorkInLastCheckpoint.toString()).eq(new BN(0)) &&
    new BN(missingAtLastCheckpoint.toString()).eq(new BN(0))
  ) {
    return {
      lastCheckpoint: currentTime,
      cummulativeWorkInLastCheckpoint: new BN(0),
      missingAtLastCheckpoint: new BN(0)
    };
  } else {
    return {
      lastCheckpoint: new BN(lastCheckpoint.toString()),
      cummulativeWorkInLastCheckpoint: new BN(
        cummulativeWorkInLastCheckpoint.toString()
      ),
      missingAtLastCheckpoint: new BN(missingAtLastCheckpoint.toString())
    };
  }
};

const calculateWorkUser = async (
  address: string,
  liquidityAssetsAmount: BN,
  liquditityTokenId: string,
  currentTime: BN,
  api: ApiPromise
) => {
  const {
    lastCheckpoint,
    cummulativeWorkInLastCheckpoint,
    missingAtLastCheckpoint
  } = await getLiquidityMintingUser(
    address,
    liquditityTokenId,
    currentTime,
    api
  );

  return calculateWork(
    liquidityAssetsAmount,
    currentTime,
    new BN(lastCheckpoint.toString()),
    new BN(cummulativeWorkInLastCheckpoint.toString()),
    new BN(missingAtLastCheckpoint.toString())
  );
};

const calculateWorkPool = async (
  liquidityAssetsAmount: BN,
  liquidityTokenId: string,
  currentTime: BN,
  api: ApiPromise
) => {
  const {
    lastCheckpoint,
    cummulativeWorkInLastCheckpoint,
    missingAtLastCheckpoint
  } = await getLiquidityMintingPool(liquidityTokenId, currentTime, api);

  return calculateWork(
    liquidityAssetsAmount,
    currentTime,
    new BN(lastCheckpoint.toString()),
    new BN(cummulativeWorkInLastCheckpoint.toString()),
    new BN(missingAtLastCheckpoint.toString())
  );
};

export const calculateFutureRewardsAmount = async (
  api: ApiPromise,
  address: string,
  liquidityTokenId: string,
  futureTimeBlockNumber: BN
) => {
  const block = await api.rpc.chain.getBlock();
  const blockNumber = new BN(block.block.header.number.toString());
  const futureBlockNumber = blockNumber.add(new BN(futureTimeBlockNumber));
  const futureTime = futureBlockNumber.div(new BN(10000));

  const liquidityAssetsAmountUser =
    await api.query.xyk.liquidityMiningActiveUser([
      address,
      new BN(liquidityTokenId)
    ]);

  const liquidityAssetsAmountPool =
    await api.query.xyk.liquidityMiningActivePool(new BN(liquidityTokenId));

  const workUser = await calculateWorkUser(
    address,
    new BN(liquidityAssetsAmountUser.toString()),
    liquidityTokenId,
    futureTime,
    api
  );

  const workPool = await calculateWorkPool(
    new BN(liquidityAssetsAmountPool.toString()),
    liquidityTokenId,
    futureTime,
    api
  );

  const burnedNotClaimedRewards =
    await api.query.xyk.liquidityMiningUserToBeClaimed([
      address,
      liquidityTokenId
    ]);

  const alreadyClaimedRewards = await api.query.xyk.liquidityMiningUserClaimed([
    address,
    liquidityTokenId
  ]);

  const currentAvailableRewardsForPool =
    await api.query.issuance.promotedPoolsRewards(liquidityTokenId);

  const currentAvailableRewardsForPoolBN = new BN(
    currentAvailableRewardsForPool.toString()
  );
  const rewardsPerSession = new BN("136986000000000000000000");
  const sessionsToPass = new BN(futureTimeBlockNumber).div(new BN(1200));
  const numberOfPromotedPools =
    await api.query.issuance.promotedPoolsRewards.entries();

  const futureAvailableRewardsForPool = currentAvailableRewardsForPoolBN.add(
    rewardsPerSession
      .mul(sessionsToPass)
      .div(new BN(numberOfPromotedPools.length))
  );

  let futureRewards = new BN(0);
  if (workUser.gt(new BN(0)) && workPool.gt(new BN(0))) {
    futureRewards = futureAvailableRewardsForPool.mul(workUser).div(workPool);
  }

  const totalAvailableRewardsFuture = futureRewards
    .add(new BN(burnedNotClaimedRewards.toString()))
    .sub(new BN(alreadyClaimedRewards.toString()));

  return totalAvailableRewardsFuture;
};
