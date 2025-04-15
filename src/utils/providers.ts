import { RpcProvider } from 'starknet';

// Create RPC provider for Starknet mainnet
export function getMainnetProvider() {
  return new RpcProvider({ 
    nodeUrl: 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
  });
}

// For future use if needed - testnet provider
export function getTestnetProvider() {
  return new RpcProvider({
    nodeUrl: 'https://starknet-testnet.public.blastapi.io/rpc/v0_7'
  });
}