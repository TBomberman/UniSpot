import { Injective } from '../injective/injective'
import { getNetworkInfo, Network } from '@injectivelabs/networks'

const getMnemonic = (): string => {
  return 'begin holiday crystal say glide saddle typical access gold undo delay jelly'
}

export const INJECTIVE_WALLET = new Injective(getNetworkInfo(Network.TestnetK8s).grpc, getMnemonic())
