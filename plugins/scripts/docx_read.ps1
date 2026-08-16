param([string]$Path)
# 读取 docx：解压 word/document.xml，按段落(w:p)提取纯文本，输出 JSON {lines:[...]}
Add-Type -AssemblyName System.IO.Compression.FileSystem
try {
  $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
  $entry = $zip.GetEntry('word/document.xml')
  if (-not $entry) { Write-Output '{"ok":false,"error":"no document.xml"}'; exit 0 }
  $reader = New-Object System.IO.StreamReader($entry.Open(), [System.Text.Encoding]::UTF8, $true)
  $xml = $reader.ReadToEnd()
  $reader.Close()
  $zip.Dispose()
  $ms = [regex]::Matches($xml, '<w:p[ >].*?</w:p>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $lines = foreach ($m in $ms) {
    $p = $m.Value
    $ts = [regex]::Matches($p, '<w:t[^>]*>([^<]*)</w:t>')
    $t = ''
    foreach ($tm in $ts) { $t += $tm.Groups[1].Value }
    $t
  }
  Write-Output (@($lines) | ConvertTo-Json -Compress)
} catch {
  Write-Output ('{"ok":false,"error":"' + ($_.Exception.Message -replace '"', "'") + '"}')
}
