param(
    [ValidateSet('dev', 'preview', 'check', 'build', 'security:check', 'format:write')]
    [string]$Task = 'dev'
)

$ErrorActionPreference = 'Stop'
$projectDirectory = Split-Path -Parent $PSScriptRoot
$npmCommand = Get-Command npm.cmd -ErrorAction Stop
$npmCli = Join-Path (Split-Path -Parent $npmCommand.Source) 'node_modules\npm\bin\npm-cli.js'
$runtimeFile = Join-Path $projectDirectory '.local\node24.txt'
$nodeExecutable = if (Test-Path -LiteralPath $runtimeFile) {
    (Get-Content -LiteralPath $runtimeFile -Raw).Trim()
} else {
    (Get-Command node.exe -ErrorAction Stop).Source
}
$previousPath = $env:Path
Push-Location -LiteralPath $projectDirectory
try {
    if ((& $nodeExecutable --version) -notmatch '^v24\.') {
        throw 'Use a project-scoped Node 24 runtime. See README.md; do not change the system runtime.'
    }
    $env:Path = (Split-Path -Parent $nodeExecutable) + ';' + $env:Path
    & $nodeExecutable $npmCli run $Task
    $taskExitCode = $LASTEXITCODE
} finally {
    $env:Path = $previousPath
    Pop-Location
}
exit $taskExitCode
