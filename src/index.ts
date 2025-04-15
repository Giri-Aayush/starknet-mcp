#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { checkAllBalances, checkCustomTokenBalance } from './tools/balanceChecker.js';
import { TOKENS } from './utils/tokens.js';

// Create a server instance
const server = new Server(
  {
    name: "starknet-reader",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "check_balance",
        description: "Check token balances for a Starknet wallet address",
        inputSchema: {
          type: "object",
          properties: {
            address: { 
              type: "string", 
              description: "The Starknet wallet address to check (must start with 0x)" 
            }
          },
          required: ["address"]
        }
      },
      {
        name: "check_custom_token",
        description: "Check balance of a specific token for a Starknet wallet address",
        inputSchema: {
          type: "object",
          properties: {
            address: { 
              type: "string", 
              description: "The Starknet wallet address to check (must start with 0x)" 
            },
            tokenAddress: { 
              type: "string", 
              description: "The token contract address to check (must start with 0x)" 
            }
          },
          required: ["address", "tokenAddress"]
        }
      },
      {
        name: "get_token_list",
        description: "Get a list of supported token addresses on Starknet",
        inputSchema: {
          type: "object",
          properties: {}
        }
      }
    ]
  };
});

// Implement tool functionality
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args && name !== "get_token_list") {
    throw new Error(`No arguments provided for tool: ${name}`);
  }

  switch (name) {
    case "check_balance": {
      try {
        if (!args) {
          throw new Error("No arguments provided");
        }
        // Type assertion to tell TypeScript args.address is a string
        const address = String(args.address);
        const result = await checkAllBalances(address);
        
        // Format the result for better display
        const formattedResult = {
          address: result.address,
          is_contract: result.isContract,
          nonce: result.nonce,
          balances: result.balances.map((b) => ({
            token: b.symbol,
            amount: b.balance,
            token_address: b.address
          }))
        };
        
        return { 
          content: [{ 
            type: "text", 
            text: JSON.stringify(formattedResult, null, 2) 
          }] 
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { 
          content: [{ type: "text", text: `Error: ${errorMessage}` }],
          isError: true
        };
      }
    }
    
    case "check_custom_token": {
      try {
        if (!args) {
          throw new Error("No arguments provided");
        }
        // Type assertions to tell TypeScript these are strings
        const address = String(args.address);
        const tokenAddress = String(args.tokenAddress);
        
        const result = await checkCustomTokenBalance(address, tokenAddress);
        
        if (!result) {
          return { 
            content: [{ 
              type: "text", 
              text: JSON.stringify({ 
                message: "No balance found for this token or token does not exist",
                address: address,
                token_address: tokenAddress
              }, null, 2) 
            }] 
          };
        }
        
        return { 
          content: [{ 
            type: "text", 
            text: JSON.stringify({
              token: result.symbol,
              amount: result.balance,
              token_address: result.address,
              wallet_address: address
            }, null, 2) 
          }] 
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { 
          content: [{ type: "text", text: `Error: ${errorMessage}` }],
          isError: true
        };
      }
    }
    
    case "get_token_list": {
      const tokenList = Object.entries(TOKENS).map(([symbol, address]) => ({
        symbol,
        address
      }));
      
      return { 
        content: [{ 
          type: "text", 
          text: JSON.stringify({ tokens: tokenList }, null, 2) 
        }] 
      };
    }
    
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Starknet Reader MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});