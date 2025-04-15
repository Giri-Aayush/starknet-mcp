import { Contract, RpcProvider } from 'starknet';
import { TokenInfo } from './tokens.js';
import { formatDecimal, feltToString } from './formatting.js';

// ERC20 ABI for checking balances, symbol and decimals
export const ERC20_ABI = [
  {
    "name": "balanceOf",
    "type": "function",
    "inputs": [{ "name": "account", "type": "felt" }],
    "outputs": [{ "name": "balance", "type": "Uint256" }],
    "stateMutability": "view"
  },
  {
    "name": "symbol",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "symbol", "type": "felt" }],
    "stateMutability": "view"
  },
  {
    "name": "decimals",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "decimals", "type": "felt" }],
    "stateMutability": "view"
  }
];

// Create a contract instance for the given token
export function getTokenContract(tokenAddress: string, provider: RpcProvider): Contract {
  return new Contract(ERC20_ABI, tokenAddress, provider);
}

// Token balance information
export interface TokenBalance {
  symbol: string;
  address: string;
  balance: string;
  decimals: number;
  rawBalance: string;
}

// Get token symbol from contract
export async function getTokenSymbol(contract: Contract): Promise<string> {
  try {
    const symbolResponse = await contract.symbol();
    if (symbolResponse && symbolResponse.symbol) {
      return feltToString(symbolResponse.symbol);
    }
  } catch (error) {
    // Ignore errors
  }
  return "UNKNOWN";
}

// Get token decimals from contract
export async function getTokenDecimals(contract: Contract): Promise<number> {
  try {
    const decimalsResponse = await contract.decimals();
    if (decimalsResponse && decimalsResponse.decimals) {
      return parseInt(decimalsResponse.decimals.toString());
    }
  } catch (error) {
    // Ignore errors
  }
  return 18; // Default to 18 decimals
}

// Get token balance for a specific address
export async function getTokenBalance(
  tokenInfo: TokenInfo, 
  walletAddress: string, 
  provider: RpcProvider
): Promise<TokenBalance | null> {
  try {
    const contract = getTokenContract(tokenInfo.address, provider);
    
    // Get balance
    const balanceResponse = await contract.balanceOf(walletAddress);
    
    if (balanceResponse && balanceResponse.balance) {
      const rawBalance = balanceResponse.balance.toString();
      const formattedBalance = formatDecimal(rawBalance, tokenInfo.decimals);
      
      if (formattedBalance !== '0') {
        return {
          symbol: tokenInfo.symbol,
          address: tokenInfo.address,
          balance: formattedBalance,
          decimals: tokenInfo.decimals,
          rawBalance
        };
      }
    }
  } catch (error) {
    // Return null for any errors
  }
  
  return null;
}