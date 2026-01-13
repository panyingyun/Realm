# Material Symbols Outlined Font Download Script
# PowerShell Script

$fontUrl = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700"
$outputFile = "MaterialSymbolsOutlined.woff2"
$cssFile = "temp_font.css"

Write-Host "Fetching font file URL..." -ForegroundColor Yellow

try {
    # Download CSS file
    Invoke-WebRequest -Uri $fontUrl -OutFile $cssFile -UseBasicParsing
    
    # Read CSS file and extract font URL
    $cssContent = Get-Content $cssFile -Raw
    $woff2Match = [regex]::Match($cssContent, 'url\(([^)]+\.woff2)\)')
    
    if ($woff2Match.Success) {
        $fontFileUrl = $woff2Match.Groups[1].Value
        Write-Host "Found font file URL: $fontFileUrl" -ForegroundColor Green
        
        # Download font file
        Write-Host "Downloading font file..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $fontFileUrl -OutFile $outputFile -UseBasicParsing
        
        if (Test-Path $outputFile) {
            $fileSize = (Get-Item $outputFile).Length / 1MB
            Write-Host "Font file downloaded successfully!" -ForegroundColor Green
            Write-Host "File size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
            Write-Host "File location: $(Resolve-Path $outputFile)" -ForegroundColor Green
        } else {
            Write-Host "Download failed: file does not exist" -ForegroundColor Red
        }
    } else {
        Write-Host "Cannot extract font file URL from CSS" -ForegroundColor Red
        Write-Host "Please manually visit the following URL and download the font file:" -ForegroundColor Yellow
        Write-Host $fontUrl -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Please download the font file manually, refer to README.md for instructions" -ForegroundColor Yellow
} finally {
    # Clean up temporary file
    if (Test-Path $cssFile) {
        Remove-Item $cssFile -ErrorAction SilentlyContinue
    }
}
