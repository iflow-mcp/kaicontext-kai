#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

try {
  const binDir = path.join(__dirname, "bin");
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }

  // Create a simple kai binary script
  const kaiScript = `#!/bin/bash
# Mock kai binary for testing
case "\$1" in
  "mcp")
    case "\$2" in
      "serve")
        # Run a simple MCP server for testing
        echo '{"jsonrpc":"2.0","method":"notifications/initialized"}'
        while read line; do
          cmd=\$(echo "\$line" | grep -o '"method":"[^"]*"' | cut -d'"' -f4)
          id=\$(echo "\$line" | grep -o '"id":[0-9]*' | cut -d':' -f2)
          
          if [ "\$cmd" = "tools/list" ]; then
            echo '{"jsonrpc":"2.0","id":'"\$id"',"result":{"tools":[{"name":"kai_symbols","description":"List symbols in a file"},{"name":"kai_callers","description":"Find all callers of a symbol"},{"name":"kai_callees","description":"Find all symbols called by a symbol"},{"name":"kai_dependents","description":"Find files that depend on a file"},{"name":"kai_dependencies","description":"Find files a file depends on"},{"name":"kai_tests","description":"Find tests covering a file"},{"name":"kai_diff","description":"Semantic diff between two refs"},{"name":"kai_context","description":"Bundled context for a file/symbol"},{"name":"kai_impact","description":"Transitive downstream impact analysis"},{"name":"kai_files","description":"List files in the repo"},{"name":"kai_status","description":"Check graph freshness"},{"name":"kai_refresh","description":"Re-capture the semantic graph"}]}}'
          elif [ "\$cmd" = "initialize" ]; then
            echo '{"jsonrpc":"2.0","id":'"\$id"',"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"serverInfo":{"name":"kai-mcp","version":"0.9.22"}}}'
          elif [ -n "\$id" ]; then
            echo '{"jsonrpc":"2.0","id":'"\$id"',"result":{}}'
          fi
        done
        ;;
      *)
        echo "Unknown kai mcp command: \$2" >&2
        exit 1
        ;;
    esac
    ;;
  *)
    echo "Unknown kai command: \$1" >&2
    exit 1
    ;;
esac`;

  const binPath = path.join(binDir, "kai");
  fs.writeFileSync(binPath, kaiScript);
  fs.chmodSync(binPath, 0o755);

  console.log(`Installed mock kai to ${binPath}`);
} catch (err) {
  console.error(`Failed to install kai binary: ${err.message}`);
  process.exit(1);
}