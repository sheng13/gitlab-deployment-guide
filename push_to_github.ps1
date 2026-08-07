param (
    [string]$RepoName = "gitlab-deployment-guide"
)

Write-Host "================================================"
Write-Host "  GitLab 部署指南文档 GitHub 一键推送工具"
Write-Host "================================================"

$workingDir = Get-Location
Write-Host "[1/4] 当前工作目录: $workingDir"

if (-not (Test-Path ".git")) {
    Write-Host "[2/4] 初始化 Git 本地仓库..."
    git init
    git branch -M main
}

Write-Host "[3/4] 暂存所有文档与图片并提交..."
git add .
git commit -m "docs: add GitLab local deployment and usage guide with diagrams and PDF"

$remoteUrl = "https://github.com/sheng13/" + $RepoName + ".git"
Write-Host "[4/4] 设置远程仓库 URL: $remoteUrl"

git remote remove origin 2>$null
git remote add origin $remoteUrl

Write-Host ""
Write-Host "✅ 本地版本库准备就绪！"
Write-Host "================================================"
Write-Host "接下来，请在终端中运行以下命令推送到 GitHub:"
Write-Host "  git push -u origin main"
Write-Host "================================================"
