param([string]$Zip, [string]$Dest)
# 解压插件仓库 zip 到目标目录并删除 zip
Expand-Archive -LiteralPath $Zip -DestinationPath $Dest -Force
Remove-Item $Zip -Force -ErrorAction SilentlyContinue
Write-Output 'OK'
