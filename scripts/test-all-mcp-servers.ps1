# PowerShell script to test all MCP servers from VS Code global settings
$mcpServers = @{
  "Context7" = @{ "command" = "npx"; "args" = @("-y", "@upstash/context7-mcp@latest") }
  "Memory" = @{ "command" = "npx"; "args" = @("-y", "@modelcontextprotocol/server-memory@latest") }
  "GitHub" = @{ "command" = "npx"; "args" = @("-y", "@modelcontextprotocol/server-github@latest") }
  "SequentialThinking" = @{ "command" = "npx"; "args" = @("-y", "@modelcontextprotocol/server-sequentialthinking@latest") }
  "GitMCP" = @{ "command" = "npx"; "args" = @("-y", "@modelcontextprotocol/server-git@latest") }
  "FilesystemMCP" = @{ "command" = "npx"; "args" = @("-y", "@modelcontextprotocol/server-filesystem@latest") }
  "DiscordMCP" = @{ "command" = "npx"; "args" = @("-y", "@modelcontextprotocol/server-discord@latest") }
  "DiscordMCPv3" = @{ "command" = "npx"; "args" = @("-y", "@v-3/discordmcp@latest") }
}

foreach ($name in $mcpServers.Keys) {
  $cmd = $mcpServers[$name].command
  $serverArgs = $mcpServers[$name].args -join ' '
  Write-Host "\nTesting MCP server: $name"
  Write-Host "Command: $cmd $serverArgs"
  try {
    $process = Start-Process -FilePath $cmd -ArgumentList $serverArgs -NoNewWindow -PassThru -RedirectStandardOutput "${name}_stdout.txt" -RedirectStandardError "${name}_stderr.txt"
    Start-Sleep -Seconds 5
    if (!$process.HasExited) {
      Write-Host "$name started successfully (running). Stopping..."
      $process | Stop-Process
    } else {
      Write-Host "$name exited immediately. Check ${name}_stderr.txt for errors."
    }
  } catch {
    $err = $_
    Write-Host "Failed to start ${name}: ${err}"
  }
}
Write-Host "\nTesting complete. Check *_stderr.txt files for any errors."
