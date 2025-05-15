# PowerShell script to test all MCP servers from global config
$mcpConfigPath = "$env:USERPROFILE\.vscode\mcp.json"

if (!(Test-Path $mcpConfigPath)) {
    Write-Host "MCP config not found at $mcpConfigPath"
    exit 1
}

$mcpConfig = Get-Content $mcpConfigPath | ConvertFrom-Json
$servers = $mcpConfig.mcpServers.psobject.Properties

foreach ($server in $servers) {
    $name = $server.Name
    $value = $server.Value
    $cmd = $value.command
    $serverArgs = $value.args -join ' '
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
