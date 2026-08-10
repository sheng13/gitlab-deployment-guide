const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { marked } = require('marked');

async function generatePDF() {
  console.log('Starting PDF Generation...');
  
  const markdownPath = path.join(__dirname, 'gitlab_deployment_guide.md');
  const pdfOutputPath = path.join(__dirname, 'GitLab_Local_Deployment_Guide.pdf');
  
  let markdownText = fs.readFileSync(markdownPath, 'utf8');

  // Convert relative image paths to base64 data URIs for embedding in PDF
  const imgRegex = /!\[(.*?)\]\(\.\/(.*?)\)/g;
  markdownText = markdownText.replace(imgRegex, (match, alt, imgFile) => {
    const fullImgPath = path.join(__dirname, imgFile);
    if (fs.existsSync(fullImgPath)) {
      const imgBuffer = fs.readFileSync(fullImgPath);
      const base64 = imgBuffer.toString('base64');
      const ext = path.extname(imgFile).replace('.', '');
      const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
      return `!<div class="img-container"><img src="data:${mimeType};base64,${base64}" alt="${alt}" /><p class="img-caption">${alt}</p></div>`;
    }
    return match;
  });

  const bodyHtml = marked.parse(markdownText);

  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>GitLab CE 19.2 完整安装、使用与管理员实战指南</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
    }
    body {
      font-family: "Noto Sans CJK TC", "Noto Sans CJK SC", "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      font-size: 14px;
      margin: 0;
      padding: 0;
    }
    h1 {
      font-size: 26px;
      color: #0f172a;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 12px;
      margin-top: 10px;
      margin-bottom: 20px;
      text-align: center;
    }
    h2 {
      font-size: 19px;
      color: #1e1b4b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 14px;
      page-break-after: avoid;
    }
    h3 {
      font-size: 15px;
      color: #334155;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }
    p {
      margin-bottom: 12px;
      text-align: justify;
    }
    blockquote {
      background: #f8fafc;
      border-left: 4px solid #6366f1;
      margin: 16px 0;
      padding: 12px 16px;
      color: #475569;
      border-radius: 0 6px 6px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 18px 0;
      font-size: 13px;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    code {
      font-family: "Consolas", "Fira Code", Monaco, monospace;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12.5px;
    }
    pre {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 14px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: "Consolas", "Fira Code", Monaco, monospace;
      font-size: 12px;
      line-height: 1.5;
      margin: 16px 0;
      page-break-inside: avoid;
    }
    pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
    }
    .img-container {
      text-align: center;
      margin: 20px 0;
      page-break-inside: avoid;
    }
    .img-container img {
      max-width: 95%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }
    .img-caption {
      font-size: 12px;
      color: #64748b;
      margin-top: 6px;
      font-style: italic;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 30px 0;
    }
    ul, ol {
      padding-left: 24px;
      margin-bottom: 14px;
    }
    li {
      margin-bottom: 6px;
    }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>
  `;

  console.log('Launching Chrome/Chromium...');
  const edgePath = process.env.CHROME_PATH || "/usr/bin/google-chrome";
  
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.evaluate(() => Promise.all(Array.from(document.images, img => img.complete ? Promise.resolve() : new Promise(resolve => { img.onload = img.onerror = resolve; }))));

  console.log('Generating PDF File...');
  await page.pdf({
    path: pdfOutputPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size: 9px; font-family: 'Microsoft YaHei'; color: #94a3b8; width: 100%; text-align: right; padding-right: 15mm;">GitLab 本地部署与使用指南</div>`,
    footerTemplate: `<div style="font-size: 9px; font-family: 'Microsoft YaHei'; color: #94a3b8; width: 100%; text-align: center;">第 <span class="pageNumber"></span> 页 / 共 <span class="totalPages"></span> 页</div>`,
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '15mm',
      right: '15mm'
    }
  });

  await browser.close();
  console.log(`✅ PDF successfully generated at: ${pdfOutputPath}`);
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
