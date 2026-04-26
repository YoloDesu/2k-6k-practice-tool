$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$env:DOTNET_CLI_HOME = Join-Path $repoRoot '.dotnet-home'
$env:DOTNET_CLI_TELEMETRY_OPTOUT = '1'

function Invoke-CheckedCommand {
    param([scriptblock]$Command)

    & $Command
    if ($LASTEXITCODE -eq 0) {
        return
    }

    throw "Command exited with $LASTEXITCODE; expected 0."
}

Invoke-CheckedCommand {
    dotnet run --project (Join-Path $repoRoot 'server/TwoKSixKPractice.Tests/TwoKSixKPractice.Tests.csproj')
}

if (-not (Test-Path (Join-Path $repoRoot 'client/node_modules'))) {
    throw 'client/node_modules is missing; run npm --prefix client install before frontend tests.'
}

Invoke-CheckedCommand {
    npm --prefix (Join-Path $repoRoot 'client') run test
}

Invoke-CheckedCommand {
    npm --prefix (Join-Path $repoRoot 'client') run build
}
