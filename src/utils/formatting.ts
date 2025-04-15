// Simple function to format a decimal number with the specified number of decimals
export function formatDecimal(value: string | bigint, decimals: number): string {
    if (!value) return '0';
    
    // Convert to a string if it's not already
    const valueStr = value.toString();
    
    // If the value is less than 10^decimals, we need to add leading zeros
    if (valueStr.length <= decimals) {
      const paddedValue = valueStr.padStart(decimals, '0');
      const trimmedFractional = paddedValue.replace(/0+$/, '');
      if (trimmedFractional === '') return '0';
      return `0.${trimmedFractional}`;
    }
    
    // Insert the decimal point at the right position
    const integerPart = valueStr.slice(0, valueStr.length - decimals) || '0';
    const fractionalPart = valueStr.slice(valueStr.length - decimals);
    
    // Remove trailing zeros from fractional part
    const trimmedFractionalPart = fractionalPart.replace(/0+$/, '');
    
    if (trimmedFractionalPart.length === 0) {
      return integerPart;
    }
    
    return `${integerPart}.${trimmedFractionalPart}`;
  }
  
  // Convert a felt (numeric) to ASCII string
  export function feltToString(felt: string | bigint): string {
    const hexString = BigInt(felt).toString(16);
    let str = '';
    
    for (let i = 0; i < hexString.length; i += 2) {
      const charCode = parseInt(hexString.substring(i, i + 2), 16);
      if (charCode > 0) {
        str += String.fromCharCode(charCode);
      }
    }
    
    return str || 'UNKNOWN';
  }
  
  // Format an address for display (truncate middle)
  export function formatAddress(address: string): string {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  
  // Format amount for display with symbol
  export function formatAmount(amount: string, symbol: string): string {
    return `${amount} ${symbol}`;
  }