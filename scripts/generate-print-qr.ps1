Add-Type -AssemblyName System.Drawing

$workspace = Split-Path -Parent $PSScriptRoot
$outputPath = Join-Path $workspace "Sneha-Heart-QR-Print.png"
$targetUrl = "https://ishivamsoni150299.github.io/gift/for-sneha/"
$qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&color=5f1e32&bgcolor=ffffff&ecc=H&qzone=4&data=$([uri]::EscapeDataString($targetUrl))"

function New-RoundedRectanglePath {
  param(
    [System.Drawing.RectangleF]$Rectangle,
    [float]$Radius
  )

  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $diameter = $Radius * 2
  $arc = [System.Drawing.RectangleF]::new($Rectangle.X, $Rectangle.Y, $diameter, $diameter)
  $path.AddArc($arc, 180, 90)
  $arc.X = $Rectangle.Right - $diameter
  $path.AddArc($arc, 270, 90)
  $arc.Y = $Rectangle.Bottom - $diameter
  $path.AddArc($arc, 0, 90)
  $arc.X = $Rectangle.X
  $path.AddArc($arc, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-CenteredText {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [System.Drawing.Font]$Font,
    [System.Drawing.Brush]$Brush,
    [float]$Y,
    [float]$CanvasWidth
  )

  $size = $Graphics.MeasureString($Text, $Font)
  $Graphics.DrawString($Text, $Font, $Brush, (($CanvasWidth - $size.Width) / 2), $Y)
}

function Draw-Flower {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$CenterX,
    [float]$CenterY,
    [float]$Scale,
    [System.Drawing.Color]$PetalColor,
    [System.Drawing.Color]$CenterColor
  )

  $petalBrush = [System.Drawing.SolidBrush]::new($PetalColor)
  $centerBrush = [System.Drawing.SolidBrush]::new($CenterColor)
  $petalSize = 84 * $Scale
  $orbit = 62 * $Scale

  for ($index = 0; $index -lt 6; $index += 1) {
    $angle = ($index * 60) * [Math]::PI / 180
    $x = $CenterX + ([Math]::Cos($angle) * $orbit) - ($petalSize / 2)
    $y = $CenterY + ([Math]::Sin($angle) * $orbit) - ($petalSize / 2)
    $Graphics.FillEllipse($petalBrush, $x, $y, $petalSize, $petalSize)
  }

  $centerSize = 74 * $Scale
  $Graphics.FillEllipse($centerBrush, $CenterX - ($centerSize / 2), $CenterY - ($centerSize / 2), $centerSize, $centerSize)
  $petalBrush.Dispose()
  $centerBrush.Dispose()
}

$width = 1800
$height = 2400
$bitmap = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bitmap.SetResolution(300, 300)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.ColorTranslator]::FromHtml("#FFF7F8"))

$gridPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(24, 220, 71, 107), 2)
for ($x = 0; $x -le $width; $x += 90) {
  $graphics.DrawLine($gridPen, $x, 0, $x, $height)
}
for ($y = 0; $y -le $height; $y += 90) {
  $graphics.DrawLine($gridPen, 0, $y, $width, $y)
}
$gridPen.Dispose()

$wineBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#5F1E32"))
$roseBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#DC476B"))
$softBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(170, 37, 23, 27))
$titleFont = [System.Drawing.Font]::new("Georgia", 86, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$labelFont = [System.Drawing.Font]::new("Segoe UI", 34, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$nameFont = [System.Drawing.Font]::new("Georgia", 104, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$captionFont = [System.Drawing.Font]::new("Segoe UI", 35, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

Draw-CenteredText $graphics "A LITTLE SURPRISE" $labelFont $roseBrush 92 $width
Draw-CenteredText $graphics "Made with love for Gudiya" $titleFont $wineBrush 148 $width

$heartPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
$heartPath.StartFigure()
$heartPath.AddBezier(900, 1940, 730, 1760, 210, 1370, 210, 790)
$heartPath.AddBezier(210, 790, 210, 400, 510, 250, 750, 250)
$heartPath.AddBezier(750, 250, 850, 250, 900, 340, 900, 340)
$heartPath.AddBezier(900, 340, 900, 340, 950, 250, 1050, 250)
$heartPath.AddBezier(1050, 250, 1290, 250, 1590, 400, 1590, 790)
$heartPath.AddBezier(1590, 790, 1590, 1370, 1070, 1760, 900, 1940)
$heartPath.CloseFigure()

$shadowState = $graphics.Save()
$graphics.TranslateTransform(0, 28)
$heartShadow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(52, 95, 30, 50))
$graphics.FillPath($heartShadow, $heartPath)
$graphics.Restore($shadowState)
$heartShadow.Dispose()

$heartBounds = [System.Drawing.Rectangle]::new(210, 250, 1380, 1690)
$heartGradient = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
  $heartBounds,
  [System.Drawing.ColorTranslator]::FromHtml("#F58AA3"),
  [System.Drawing.ColorTranslator]::FromHtml("#BD3155"),
  55
)
$graphics.FillPath($heartGradient, $heartPath)
$heartGradient.Dispose()

$panelRect = [System.Drawing.RectangleF]::new(420, 610, 960, 960)
$panelPath = New-RoundedRectanglePath $panelRect 36
$panelShadowState = $graphics.Save()
$graphics.TranslateTransform(0, 18)
$panelShadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(55, 95, 30, 50))
$graphics.FillPath($panelShadowBrush, $panelPath)
$graphics.Restore($panelShadowState)
$panelShadowBrush.Dispose()

$whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
$graphics.FillPath($whiteBrush, $panelPath)

$webClient = [System.Net.WebClient]::new()
$qrBytes = $webClient.DownloadData($qrUrl)
$webClient.Dispose()
$stream = [System.IO.MemoryStream]::new($qrBytes, $false)
$qrImage = [System.Drawing.Image]::FromStream($stream)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$graphics.DrawImage($qrImage, [System.Drawing.Rectangle]::new(470, 660, 860, 860))
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

Draw-Flower $graphics 300 615 1.05 ([System.Drawing.ColorTranslator]::FromHtml("#F48AA4")) ([System.Drawing.ColorTranslator]::FromHtml("#F4C95D"))
Draw-Flower $graphics 1510 680 0.9 ([System.Drawing.ColorTranslator]::FromHtml("#F4B7C5")) ([System.Drawing.ColorTranslator]::FromHtml("#E8B23C"))
Draw-Flower $graphics 1430 1560 0.82 ([System.Drawing.ColorTranslator]::FromHtml("#FFF0A8")) ([System.Drawing.ColorTranslator]::FromHtml("#DC476B"))

$smallHeart = [System.Drawing.Drawing2D.GraphicsPath]::new()
$smallHeart.AddBezier(900, 1810, 820, 1740, 730, 1660, 730, 1570)
$smallHeart.AddBezier(730, 1570, 730, 1490, 800, 1460, 850, 1460)
$smallHeart.AddBezier(850, 1460, 880, 1460, 900, 1490, 900, 1490)
$smallHeart.AddBezier(900, 1490, 900, 1490, 920, 1460, 950, 1460)
$smallHeart.AddBezier(950, 1460, 1000, 1460, 1070, 1490, 1070, 1570)
$smallHeart.AddBezier(1070, 1570, 1070, 1660, 980, 1740, 900, 1810)
$smallHeart.CloseFigure()
$graphics.FillPath($whiteBrush, $smallHeart)

Draw-CenteredText $graphics "FOR SNEHA" $nameFont $wineBrush 2010 $width
Draw-CenteredText $graphics "SCAN WITH LOVE  |  17 JULY 2026" $captionFont $softBrush 2148 $width

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$qrImage.Dispose()
$stream.Dispose()
$smallHeart.Dispose()
$panelPath.Dispose()
$heartPath.Dispose()
$whiteBrush.Dispose()
$wineBrush.Dispose()
$roseBrush.Dispose()
$softBrush.Dispose()
$titleFont.Dispose()
$labelFont.Dispose()
$nameFont.Dispose()
$captionFont.Dispose()
$graphics.Dispose()
$bitmap.Dispose()

Write-Output $outputPath
