// Token addresses on Mainnet
export const TOKENS = {
    ETH: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    STRK: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    USDC: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    USDT: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
    DAI: '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
    WBTC: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
    EKUBO: '0x075afe6402ad5a5c20dd25e10ec3b3986acaa647b77e4ae24b0cbc9a54a27a87',
    NSTR: '0x00c530f2c0aa4c16a0806365b0898499fba372e5df7a7172dc6fe9ba777e8007',
    BROTHER: '0x03b405a98c9e795d427fe82cdeeeed803f221b52471e3a757574a2b4180793ee'
  };
  
  // Default decimals for common tokens
  export const TOKEN_DECIMALS = {
    ETH: 18,
    STRK: 18,
    USDC: 6,
    USDT: 6,
    DAI: 18,
    WBTC: 8,
    EKUBO: 18,
    NSTR: 18,
    BROTHER: 18
  };
  
  // Simple token information interface
  export interface TokenInfo {
    symbol: string;
    address: string;
    decimals: number;
  }
  
  // Create a TokenInfo object from symbol and address
  export function createTokenInfo(symbol: string, address: string, decimals?: number): TokenInfo {
    return {
      symbol,
      address,
      decimals: decimals ?? TOKEN_DECIMALS[symbol as keyof typeof TOKEN_DECIMALS] ?? 18
    };
  }
  
  // Get all default tokens as TokenInfo objects
  export function getAllTokens(): TokenInfo[] {
    return Object.entries(TOKENS).map(([symbol, address]) => 
      createTokenInfo(symbol, address)
    );
  }