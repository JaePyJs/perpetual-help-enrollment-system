param(
    [Parameter(Mandatory=$true)]
    [string]$newProjectPath
)

# Create .vscode directory in the new project if it doesn't exist
$vscodePath = Join-Path $newProjectPath ".vscode"
if (-not (Test-Path $vscodePath)) {
    New-Item -Path $vscodePath -ItemType Directory | Out-Null
    Write-Host "Created .vscode directory in $newProjectPath"
}

# Create settings.json with MCP configuration
$settingsPath = Join-Path $vscodePath "settings.json"
$mcpConfig = @{
    "mcp.servers" = @{
        "Context7" = @{
            "type" = "stdio"
            "command" = "npx"
            "args" = @("-y", "@upstash/context7-mcp@latest")
        }
        "Memory" = @{
            "type" = "stdio"
            "command" = "npx"
            "args" = @("-y", "@modelcontextprotocol/server-memory@latest")
        }
        "GitHub" = @{
            "type" = "stdio"
            "command" = "npx"
            "args" = @("-y", "@modelcontextprotocol/server-github@latest")
        }
        "SequentialThinking" = @{
            "type" = "stdio"
            "command" = "npx"
            "args" = @("-y", "@modelcontextprotocol/server-sequentialthinking@latest")
        }
        "GitMCP" = @{
            "type" = "stdio"
            "command" = "npx"
            "args" = @("-y", "@modelcontextprotocol/server-git@latest")
        }
        "FilesystemMCP" = @{
            "type" = "stdio"
            "command" = "npx"
            "args" = @("-y", "@modelcontextprotocol/server-filesystem@latest")
        }
        "TimeMCP" = @{
            "type" = "stdio"
            "command" = "npx"
            "args" = @("-y", "@modelcontextprotocol/server-time@latest")
        }
    }
}

# Create mcp-servers directory in the new project
$mcpServersPath = Join-Path $newProjectPath "mcp-servers"
if (-not (Test-Path $mcpServersPath)) {
    New-Item -Path $mcpServersPath -ItemType Directory | Out-Null
    Write-Host "Created mcp-servers directory in $newProjectPath"
}

# Add the serverPath setting to the configuration
$mcpConfig["mcp.serverPath"] = "$mcpServersPath"

# Check if settings.json exists and read existing content
if (Test-Path $settingsPath) {
    $existingConfig = Get-Content -Path $settingsPath -Raw | ConvertFrom-Json
    
    # Convert to hashtable for easier manipulation
    $existingHashtable = @{}
    $existingConfig.PSObject.Properties | ForEach-Object {
        $existingHashtable[$_.Name] = $_.Value
    }
    
    # Add MCP config to existing config
    $mcpConfig.Keys | ForEach-Object {
        $existingHashtable[$_] = $mcpConfig[$_]
    }
    
    # Convert back to JSON
    $combinedConfig = $existingHashtable
} else {
    $combinedConfig = $mcpConfig
}

# Write the configuration to settings.json
$combinedConfig | ConvertTo-Json -Depth 10 | Set-Content -Path $settingsPath
Write-Host "MCP configuration written to $settingsPath"
Write-Host "MCP servers are now configured for your new project!"
