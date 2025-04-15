import { getMainnetProvider } from '../utils/providers.js';
import { createTokenInfo, getAllTokens } from '../utils/tokens.js';
import { getTokenBalance, TokenBalance } from '../utils/contracts.js';
import { formatAddress } from '../utils/formatting.js';

// Check if an address is valid
function isValidStarknetAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{1,64}$/.test(address);
}

// Check single token balance
export async function checkTokenBalance(walletAddress: string, tokenAddress: string): Promise<TokenBalance | null> {
  if (!isValidStarknetAddress(walletAddress)) {
    throw new Error(`Invalid Starknet address: ${walletAddress}`);
  }
  
  if (!isValidStarknetAddress(tokenAddress)) {
    throw new Error(`Invalid token address: ${tokenAddress}`);
  }
  
  const provider = getMainnetProvider();
  
  // Create token info with unknown symbol initially
  const tokenInfo = createTokenInfo('CUSTOM', tokenAddress);
  
  // Get token balance
  return await getTokenBalance(tokenInfo, walletAddress, provider);
}

// Check all token balances for a wallet
export async function checkAllBalances(walletAddress: string): Promise<{
  address: string;
  formattedAddress: string;
  isContract: boolean;
  nonce: string;
  balances: TokenBalance[];
}> {
  if (!isValidStarknetAddress(walletAddress)) {
    throw new Error(`Invalid Starknet address: ${walletAddress}`);
  }
  
  const provider = getMainnetProvider();
  const allTokens = getAllTokens();
  const balances: TokenBalance[] = [];
  
  // Check if contract
  let isContract = false;
  try {
    const codeResult = await provider.getClassHashAt(walletAddress);
    if (codeResult) {
      isContract = true;
    }
  } catch (error) {
    // Not a contract or cannot determine
  }
  
  // Get nonce
  let nonce = '0';
  try {
    nonce = (await provider.getNonceForAddress(walletAddress)).toString();
  } catch (error) {
    // Could not get nonce
  }
  
  // Check all token balances in parallel
  const balancePromises = allTokens.map((token) => 
    getTokenBalance(token, walletAddress, provider)
  );
  
  const results = await Promise.all(balancePromises);
  
  // Filter out null results and add to balances
  results.forEach((result) => {
    if (result !== null) {
      balances.push(result);
    }
  });
  
  return {
    address: walletAddress,
    formattedAddress: formatAddress(walletAddress),
    isContract,
    nonce,
    balances
  };
}

// Check balances for a custom token
export async function checkCustomTokenBalance(walletAddress: string, tokenAddress: string): Promise<TokenBalance | null> {
  if (!isValidStarknetAddress(walletAddress)) {
    throw new Error(`Invalid Starknet address: ${walletAddress}`);
  }
  
  if (!isValidStarknetAddress(tokenAddress)) {
    throw new Error(`Invalid token address: ${tokenAddress}`);
  }
  
  const provider = getMainnetProvider();
  
  // Create token info with unknown symbol initially
  const tokenInfo = createTokenInfo('CUSTOM', tokenAddress);
  
  // Get token balance
  return await getTokenBalance(tokenInfo, walletAddress, provider);
}