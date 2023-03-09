import { BN } from "@polkadot/util";
import { getRatio } from "../../utils/getRatio";
import { getLiquidityPool } from "./getLiquidityPool";
import { getAmountOfTokenIdInPool } from "./getAmountOfTokenIdInPool";
import { BN_ZERO } from "../../utils/bnConstants";
export const getPool = async (instancePromise, liquidityTokenId) => {
    const api = await instancePromise;
    const [liquidityPoolTokens, promotedPoolRewardsV2] = await Promise.all([
        getLiquidityPool(instancePromise, liquidityTokenId),
        api.query.issuance.promotedPoolsRewardsV2()
    ]);
    const promotedPoolInfos = promotedPoolRewardsV2.toHuman();
    const isPoolPromoted = promotedPoolInfos[liquidityTokenId];
    const [firstTokenId, secondTokenId] = liquidityPoolTokens;
    const [firstTokenAmount, secondTokenAmount] = await getAmountOfTokenIdInPool(instancePromise, firstTokenId.toString(), secondTokenId.toString());
    return {
        firstTokenId: firstTokenId.toString(),
        secondTokenId: secondTokenId.toString(),
        firstTokenAmount,
        secondTokenAmount,
        liquidityTokenId,
        isPromoted: isPoolPromoted === undefined
            ? false
            : new BN(isPoolPromoted.rewards.replace(/[, ]/g, "")).gt(BN_ZERO),
        firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
        secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount)
    };
};
