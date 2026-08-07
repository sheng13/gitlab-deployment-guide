@echo off
chcp 65001 > nul
echo ================================================
echo   GitLab 部署指南文档 GitHub 一键推送工具
echo ================================================

echo [1/4] 初始化 Git 本地仓库...
if not exist .git (
    git init
    git branch -M main
)

echo [2/4] 暂存所有文档与图片...
git add .

echo [3/4] 提交本地版本...
git commit -m "docs: add GitLab local deployment and usage guide with diagrams and PDF"

echo [4/4] 设置远程仓库 URL: https://github.com/sheng13/gitlab-deployment-guide.git
git remote remove origin >nul 2>&1
git remote add origin https://github.com/sheng13/gitlab-deployment-guide.git

echo.
echo ✅ 本地版本库准备就绪！
echo ================================================
echo 接下来，请在终端中运行以下命令推送到 GitHub:
echo   git push -u origin main
echo ================================================
