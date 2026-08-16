param([string]$Path, [string]$Json)
# 写回 docx：JSON {lines:[...]}（每行一段），段落级替换 word/document.xml 里的 w:p，
# 保留每段 pPr 与第一个 run 的 rPr（样式/编号/颜色），增行复制末段样式、删行丢弃尾部段落。
# JSON 输入优先走 $Json 参数；否则读进程 stdin（宿主 subprocess 用 {data} 批量写）。
Add-Type -AssemblyName System.IO.Compression.FileSystem
try {
  if ([string]::IsNullOrWhiteSpace($Json)) {
    $Json = [Console]::In.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($Json)) { $Json = $input | Out-String }
  }
  $lines = @($Json | ConvertFrom-Json)
  if ($null -eq $lines) { Write-Output '{"ok":false,"error":"empty input"}'; exit 0 }
  $zip = [System.IO.Compression.ZipFile]::Open($Path, [System.IO.Compression.ZipArchiveMode]::Update)
  $entry = $zip.GetEntry('word/document.xml')
  $s1 = $entry.Open()
  $reader = New-Object System.IO.StreamReader($s1, [System.Text.Encoding]::UTF8, $true)
  $xml = $reader.ReadToEnd()
  $reader.Dispose()
  $ms = [regex]::Matches($xml, '<w:p[ >].*?</w:p>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $paras = @($ms | ForEach-Object { $_.Value })
  $total = $paras.Count
  if ($total -eq 0) { $zip.Dispose(); Write-Output '{"ok":false,"error":"no paragraphs"}'; exit 0 }
  function New-Para([string]$pXml, [string]$text) {
    $open = [regex]::Match($pXml, '^<w:p[^>]*>').Value
    if (-not $open) { $open = '<w:p>' }
    $ppr = [regex]::Match($pXml, '<w:pPr>.*?</w:pPr>', [System.Text.RegularExpressions.RegexOptions]::Singleline).Value
    $rm = [regex]::Match($pXml, '<w:r>.*?</w:r>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    $rpr = ''
    if ($rm.Success) { $rpr = [regex]::Match($rm.Value, '<w:rPr>.*?</w:rPr>', [System.Text.RegularExpressions.RegexOptions]::Singleline).Value }
    $e = $text -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;'
    return $open + $ppr + '<w:r>' + $rpr + '<w:t xml:space="preserve">' + $e + '</w:t></w:r></w:p>'
  }
  $out = ''
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($i -lt $total) { $out += New-Para $paras[$i] ([string]$lines[$i]) }
    else { $out += New-Para $paras[$total - 1] ([string]$lines[$i]) }
  }
  $s2 = $entry.Open()
  $s2.SetLength(0)
  $s2.Position = 0
  $writer = New-Object System.IO.StreamWriter($s2, (New-Object System.Text.UTF8Encoding($false)))
  $writer.Write($out)
  $writer.Flush()
  $writer.Dispose()
  $zip.Dispose()
  Write-Output '{"ok":true}'
} catch {
  Write-Output ('{"ok":false,"error":"' + ($_.Exception.Message -replace '"', "'") + '"}')
}
