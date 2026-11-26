$ErrorActionPreference = 'Stop'
$projectDirectory = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $projectDirectory
try {
    & (Join-Path $PSScriptRoot 'run-local.ps1') -Task check
    if ($LASTEXITCODE -ne 0) { throw 'Production checks failed; no release was packaged.' }
    & (Join-Path $PSScriptRoot 'run-local.ps1') -Task 'security:check'
    if ($LASTEXITCODE -ne 0) { throw 'Dependency audit failed; no release was packaged.' }

    $distDirectory = (Resolve-Path -LiteralPath 'dist').Path
    $files = @(Get-ChildItem -LiteralPath $distDirectory -File -Recurse | Sort-Object FullName | ForEach-Object {
        [ordered]@{
            path = $_.FullName.Substring($distDirectory.Length + 1).Replace('\', '/')
            bytes = $_.Length
            sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
        }
    })
    $stamp = [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssfffZ')
    $releaseDirectory = Join-Path $projectDirectory ".local/releases/inferno-cyber-monday-$stamp"
    $null = New-Item -ItemType Directory -Path $releaseDirectory
    $archivePath = Join-Path $releaseDirectory 'site.zip'
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($distDirectory, $archivePath)

    # Read the ZIP back and compare every entry to the checked output.
    $archive = [System.IO.Compression.ZipFile]::OpenRead($archivePath)
    try {
        if ($archive.Entries.Count -ne $files.Count) { throw 'ZIP entry count does not match the build.' }
        foreach ($entry in $archive.Entries) {
            $entryPath = $entry.FullName.Replace('\', '/')
            $expected = @($files | Where-Object { $_.path -ceq $entryPath })
            if ($expected.Count -ne 1) { throw "Unexpected ZIP entry: $entryPath" }
            $stream = $entry.Open()
            $hasher = [System.Security.Cryptography.SHA256]::Create()
            try {
                $actualHash = ([BitConverter]::ToString($hasher.ComputeHash($stream))).Replace('-', '').ToLowerInvariant()
                if ($actualHash -ne $expected[0].sha256) { throw "ZIP checksum mismatch: $entryPath" }
            } finally { $hasher.Dispose(); $stream.Dispose() }
        }
    } finally { $archive.Dispose() }

    $manifest = [ordered]@{
        project = 'inferno-cyber-monday'
        createdAt = [DateTime]::UtcNow.ToString('o')
        archiveSha256 = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
        checks = @('npm run check', 'npm run security:check', 'ZIP entry SHA-256 verification')
        indexing = 'noindex, nofollow (preserved)'
        files = $files
    }
    $manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $releaseDirectory 'manifest.json') -Encoding utf8
    Write-Output "Verified production package: $archivePath"
    Write-Output "SHA-256: $($manifest.archiveSha256)"
} finally { Pop-Location }
