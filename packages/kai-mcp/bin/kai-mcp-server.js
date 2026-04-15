#!/usr/bin/env node
"use strict";

// A pure Node.js mock MCP server for testing with complete tool definitions
const readline = require('readline');

const tools = [
  { 
    name: 'kai_symbols', 
    description: 'List symbols in a file (functions, classes, methods)',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string', description: 'File path' },
        kind: { type: 'string', description: 'Symbol kind filter' }
      }
    }
  },
  { 
    name: 'kai_callers', 
    description: 'Find all callers of a symbol',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Symbol name' }
      }
    }
  },
  { 
    name: 'kai_callees', 
    description: 'Find all symbols called by a symbol',
    inputSchema: {
      type: 'object',
      properties: {
        symbol: { type: 'string', description: 'Symbol name' }
      }
    }
  },
  { 
    name: 'kai_dependents', 
    description: 'Find files that depend on a file',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string', description: 'File path' }
      }
    }
  },
  { 
    name: 'kai_dependencies', 
    description: 'Find files a file depends on',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string', description: 'File path' }
      }
    }
  },
  { 
    name: 'kai_tests', 
    description: 'Find tests covering a file',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string', description: 'File path' }
      }
    }
  },
  { 
    name: 'kai_diff', 
    description: 'Semantic diff between two refs',
    inputSchema: {
      type: 'object',
      properties: {
        from: { type: 'string', description: 'From ref' },
        to: { type: 'string', description: 'To ref' }
      }
    }
  },
  { 
    name: 'kai_context', 
    description: 'Bundled context for a file/symbol',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string', description: 'File path' },
        symbol: { type: 'string', description: 'Symbol name' }
      }
    }
  },
  { 
    name: 'kai_impact', 
    description: 'Transitive downstream impact analysis',
    inputSchema: {
      type: 'object',
      properties: {
        file: { type: 'string', description: 'File path' }
      }
    }
  },
  { 
    name: 'kai_files', 
    description: 'List files in the repo with language/module filters',
    inputSchema: {
      type: 'object',
      properties: {
        language: { type: 'string', description: 'Language filter' }
      }
    }
  },
  { 
    name: 'kai_status', 
    description: 'Check graph freshness',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  { 
    name: 'kai_refresh', 
    description: 'Re-capture the semantic graph',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (line) => {
  try {
    const request = JSON.parse(line);
    let response;

    switch (request.method) {
      case 'initialize':
        response = {
          jsonrpc: '2.0',
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'kai-mcp', version: '0.9.22' }
          },
          id: request.id
        };
        break;
      case 'tools/list':
        response = {
          jsonrpc: '2.0',
          result: {
            tools: tools
          },
          id: request.id
        };
        break;
      case 'initialized':
        // No response needed for initialized notification
        return;
      case 'ping':
        response = { jsonrpc: '2.0', result: {}, id: request.id };
        break;
      default:
        response = { jsonrpc: '2.0', result: {}, id: request.id };
    }

    console.log(JSON.stringify(response));
  } catch (error) {
    console.error(JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null }));
  }
});