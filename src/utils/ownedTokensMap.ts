import { TAsset } from '..'

export const ownedTokensMap = (ownedTokens: TAsset[]) => {
  let mapOwnedTokens = new Map<string, TAsset>()
  ownedTokens.forEach((item: TAsset) => mapOwnedTokens.set(item.id, item))

  return Array.from(mapOwnedTokens).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {} as { [id: string]: TAsset })
}
