# Starknet MCP Calculator Server

A simple MCP (Model Context Protocol) calculator server that integrates with Claude AI. This server provides basic calculator functionality through the MCP protocol, allowing Claude to perform calculations by connecting to your server.

## Features

- Basic arithmetic operations:
  - Addition
  - Multiplication

## Requirements

- Node.js v18 or higher
- npm package manager
- Claude AI with MCP support

## Detailed Setup Guide

### Setting up the repository

```bash
# Clone the repository
git clone https://github.com/Giri-Aayush/starknet-mcp.git
cd starknet-mcp

# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Make the output file executable
chmod +x dist/index.js
```

### Configuring Claude

1. Open Claude
2. Click on the Settings icon (gear) in the top-right
3. Select "Developer" in the sidebar
4. In the MCP Servers section, click "Edit Config"
5. Add your server configuration:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "node",
      "args": ["/full/path/to/starknet-mcp/dist/index.js"]
    }
  }
}
```

Replace `/full/path/to/starknet-mcp/dist/index.js` with the actual full path to your compiled JavaScript file (e.g., `/Users/username/starknet-mcp/dist/index.js`).

6. Click "Save"
7. Toggle the switch next to your calculator server to enable it
8. Close the settings panel

## Using the Calculator Server

With your MCP server configured and enabled, you can now ask Claude to use the calculator:

- "Can you use the calculator to add 128 and 456?"
- "What is 25 multiplied by 17? Please use the calculator tool."

Claude will use your MCP server to perform these calculations and show you the results.

## Troubleshooting

If you encounter issues:

1. Make sure the server is enabled in Claude's settings
2. Verify the path to your server is correct
3. Check your Node.js version (should be v18+)
4. If Claude shows "Server disconnected", click "Open Logs Folder" to see error logs

## Project Structure

```
starknet-mcp/
├── dist/               # Compiled JavaScript files
├── src/                # TypeScript source code
│   └── index.ts        # Main server code
├── package.json        # Project configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This documentation
```

## Development

To modify or extend the calculator:

1. Edit the source code in `src/index.ts`
2. Rebuild the project:
   ```bash
   npm run build
   ```
3. Restart the server in Claude settings

## License

MIT

## Contributing

Pull requests and issues are welcome! Feel free to improve this MCP server or add new functionality.