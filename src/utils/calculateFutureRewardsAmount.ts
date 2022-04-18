import Big from 'big.js'
import { ApiPromise } from '@polkadot/api'
import { BN } from '@polkadot/util'

const toPlainString = (num: string) => {
  // BN.js Throws from 1e+21 and above so using this make shift function
  return ('' + num).replace(/(-?)(\d*)\.?(\d+)e([+-]\d+)/, function (a, b, c, d, e) {
    return e < 0
      ? b + '0.' + Array(1 - e - c.length).join('0') + c + d
      : b + c + d + Array(e - d.length + 1).join('0')
  })
}

const calculateMissingAtCheckpoint = (
  timePassed: BN,
  liquidityAssetsAdded: BN,
  missingAtLastCheckpoint: BN
) => {
  const precision = Big(10000)
  const qPow = Big(1.06).pow(timePassed.toNumber()).mul(precision).round(0, 0)
  const qPowCorrect = toPlainString(qPow.toString())
  const missingAtCheckpoint = liquidityAssetsAdded.add(
    missingAtLastCheckpoint.mul(new BN(precision.toString())).div(new BN(qPowCorrect))
  )
  return missingAtCheckpoint
}

const calculateWork = (
  asymptote: BN,
  time: BN,
  lastCheckpoint: BN,
  cummulativeWorkInLastCheckpoint: BN,
  missingAtLastCheckpoint: BN
) => {
  const timePassed = time.sub(lastCheckpoint)
  const cummulativeWorkNewMaxPossible = new BN(asymptote).mul(timePassed)
  const base = new BN(missingAtLastCheckpoint).mul(new BN(106)).div(new BN(6))
  const precision = Big(10000)
  const qPow = Big(1.06).pow(timePassed.toNumber()).mul(precision).round(0, 0)
  const qPowCorrect = toPlainString(qPow.toString())
  const cummulativeMissingNew = new BN(base).sub(
    new BN(base).mul(new BN(precision.toString())).div(new BN(qPowCorrect))
  )
  const cummulativeWorkNew = new BN(cummulativeWorkNewMaxPossible).sub(cummulativeMissingNew)
  const workTotal = new BN(cummulativeWorkInLastCheckpoint).add(cummulativeWorkNew)

  return workTotal
}

const getLiquidityMintingUser = async (
  address: string,
  liquidityAssetsAmount: BN,
  liquditityTokenId: string,
  currentTime: BN,
  api: ApiPromise
) => {
  const [lastCheckpoint, cummulativeWorkInLastCheckpoint, missingAtLastCheckpoint] =
    await api.query.xyk.liquidityMiningUser([address, liquditityTokenId])

  if (
    new BN(lastCheckpoint.toString()).eq(new BN(0)) &&
    new BN(cummulativeWorkInLastCheckpoint.toString()).eq(new BN(0)) &&
    new BN(missingAtLastCheckpoint.toString()).eq(new BN(0))
  ) {
    if (new BN(liquidityAssetsAmount).eq(new BN(0))) {
      return {
        lastCheckpoint: currentTime,
        cummulativeWorkInLastCheckpoint: Big(0),
        missingAtLastCheckpoint: Big(0),
      }
    } else {
      const poolPromotionStart = await api.query.xyk.poolPromotionStart(liquditityTokenId)
      const workUser = calculateWork(
        liquidityAssetsAmount,
        currentTime,
        new BN(poolPromotionStart.toString()),
        new BN(0),
        liquidityAssetsAmount
      )

      const timePassed = currentTime.sub(new BN(poolPromotionStart.toString()))
      const userMissingAtCheckpoint = calculateMissingAtCheckpoint(
        timePassed,
        new BN(0),
        liquidityAssetsAmount
      )

      return {
        lastCheckpoint: currentTime,
        cummulativeWorkInLastCheckpoint: workUser,
        missingAtLastCheckpoint: userMissingAtCheckpoint,
      }
    }
  } else {
    return {
      lastCheckpoint: Big(lastCheckpoint.toString()),
      cummulativeWorkInLastCheckpoint: Big(cummulativeWorkInLastCheckpoint.toString()),
      missingAtLastCheckpoint: Big(missingAtLastCheckpoint.toString()),
    }
  }
}

const calculateWorkUser = async (
  address: string,
  liquidityAssetsAmount: BN,
  liquditityTokenId: string,
  currentTime: BN,
  api: ApiPromise
) => {
  const { lastCheckpoint, cummulativeWorkInLastCheckpoint, missingAtLastCheckpoint } =
    await getLiquidityMintingUser(
      address,
      liquidityAssetsAmount,
      liquditityTokenId,
      currentTime,
      api
    )

  return calculateWork(
    liquidityAssetsAmount,
    currentTime,
    new BN(lastCheckpoint.toString()),
    new BN(cummulativeWorkInLastCheckpoint.toString()),
    new BN(missingAtLastCheckpoint.toString())
  )
}

const calculateWorkPool = async (
  liquidityAssetsAmount: BN,
  liquidityTokenId: string,
  currentTime: BN,
  api: ApiPromise
) => {
  const [lastCheckpointPool, cummulativeWorkInLastCheckpointPool, missingAtLastCheckpointPool] =
    await api.query.xyk.liquidityMiningPool(liquidityTokenId)

  return calculateWork(
    liquidityAssetsAmount,
    currentTime,
    new BN(lastCheckpointPool.toString()),
    new BN(cummulativeWorkInLastCheckpointPool.toString()),
    new BN(missingAtLastCheckpointPool.toString())
  )
}

export const calculateFutureRewardsAmount = async (
  api: ApiPromise,
  address: string,
  liquidityTokenId: string,
  futureTimeBlockNumber: BN
) => {
  const block = await api.rpc.chain.getBlock()
  const blockNumber = new BN(block.block.header.number.toString())
  const currentTime = blockNumber.div(new BN(10000))
  const futureBlockNumber = blockNumber.add(new BN(futureTimeBlockNumber))
  const futureTime = futureBlockNumber.div(new BN(10000))

  const { free: liquidityAssetsAmount } = await api.query.tokens.accounts(address, liquidityTokenId)

  const workUser = await calculateWorkUser(
    address,
    liquidityAssetsAmount,
    liquidityTokenId,
    futureTime,
    api
  )

  const workPool = await calculateWorkPool(liquidityAssetsAmount, liquidityTokenId, futureTime, api)

  const burnedNotClaimedRewards = await api.query.xyk.liquidityMiningUserToBeClaimed([
    address,
    liquidityTokenId,
  ])

  const currentAvailableRewardsForPool = await api.query.issuance.promotedPoolsRewards(
    liquidityTokenId
  )

  const rewardsPerSession = new BN('136986000000000000000000')
  const sessionsToPass = futureTime.sub(currentTime).div(new BN(1200))
  const numberOfPromotedPools = await api.query.xyk.poolPromotionStart.entries()

  const futureAvailableRewardsForPool = currentAvailableRewardsForPool.add(
    rewardsPerSession.mul(sessionsToPass).div(new BN(numberOfPromotedPools.length))
  )

  let futureRewards = new BN(0)
  if (workUser.gt(new BN(0)) && workPool.gt(new BN(0))) {
    futureRewards = futureAvailableRewardsForPool.mul(workUser).div(workPool)
  }

  const totalAvailableRewardsFuture = futureRewards.add(burnedNotClaimedRewards)

  return totalAvailableRewardsFuture
}

// export const calculateRewardsAmount = async (address: string, liquidityTokenId: string) => {
//   const mangata = Mangata.getInstance('ws://127.0.0.1:9988')
//   const api = await mangata.getApi()
//   const block = await mangata.getBlockNumber()
//   const blockNumber = new BN(block)
//   console.log('blockNumber calculate rewards', blockNumber.toString())
//   const currentTime = blockNumber.div(new BN(5))
//   console.log('currentTime calculate rewards', currentTime.toString())

//   const { free: liquidityAssetsAmount } = await api.query.tokens.accounts(address, liquidityTokenId)

//   const workUser = await calculateWorkUser(
//     address,
//     liquidityAssetsAmount,
//     liquidityTokenId,
//     currentTime,
//     api
//   )

//   const workPool = await calculateWorkPool(
//     liquidityAssetsAmount,
//     liquidityTokenId,
//     currentTime,
//     api
//   )

//   let burnedNotClaimedRewards = await api.query.xyk.liquidityMiningUserToBeClaimed([
//     address,
//     liquidityTokenId,
//   ])

//   let currentRewards = await calculateRewards(workUser, workPool, liquidityTokenId, api)

//   const totalAvailableRewards = new BN(currentRewards).add(
//     new BN(burnedNotClaimedRewards.toString())
//   )

//   return {
//     notYetClaimed: currentRewards,
//     toBeClaimed: burnedNotClaimedRewards,
//     totalAvailableRewards: totalAvailableRewards,
//   }
// }

// const calculateRewards = async (
//   workUser: BN,
//   workPool: BN,
//   liquditityTokenId: string,
//   api: ApiPromise
// ) => {
//   const availableRewardsForPool = await api.query.issuance.promotedPoolsRewards(liquditityTokenId)
//   let userMangataRewardsAmount = new BN(0)
//   if (workUser.gt(new BN(0)) && workPool.gt(new BN(0))) {
//     userMangataRewardsAmount = new BN(availableRewardsForPool.toString())
//       .mul(workUser)
//       .div(workPool)
//   }

//   return userMangataRewardsAmount
// }
