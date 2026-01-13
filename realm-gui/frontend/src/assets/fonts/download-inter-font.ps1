# Download Inter font files
$fontDir = Join-Path $PSScriptRoot "Inter"
if (-not (Test-Path $fontDir)) {
    New-Item -ItemType Directory -Path $fontDir | Out-Null
}

Write-Host "Downloading Inter font files..."

# Inter font URLs from Google Fonts CDN
$fonts = @{
    "Inter-Light.woff2" = "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
    "Inter-Regular.woff2" = "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
    "Inter-Medium.woff2" = "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
    "Inter-SemiBold.woff2" = "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
    "Inter-Bold.woff2" = "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
    "Inter-Black.woff2" = "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
}

# Note: The URLs above are placeholders. You need to get the actual URLs from:
# 1. Visit https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap
# 2. Extract the actual woff2 URLs for each weight
# 3. Update the URLs above

Write-Host "Please visit https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap"
Write-Host "Extract the woff2 URLs and update this script, then run it again."
