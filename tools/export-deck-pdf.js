/**
 * enCODE Demoboard → PDF Exporter
 *
 * Usage: node tools/export-deck-pdf.js [path/to/presentation.html] [output.pdf]
 *
 * Defaults:
 *   input  → public/encode/presentation.html
 *   output → ~/Downloads/enCODE-Deck.pdf
 *
 * Requires: puppeteer-core, pdf-lib  (npm install in this repo or globally)
 * Chrome:   /Applications/Google Chrome.app (macOS assumed)
 */

const puppeteer = require('puppeteer-core');
const { PDFDocument } = require('pdf-lib');
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const HTML   = path.resolve(process.argv[2] || path.join(__dirname, '../public/encode/presentation.html'));
const OUT    = path.resolve(process.argv[3] || path.join(os.homedir(), 'Downloads', 'enCODE-Deck.pdf'));

function extractSrcdocs(html) {
  const slides = [];
  let pos = 0;
  while (true) {
    const start = html.indexOf('srcdoc="', pos);
    if (start === -1) break;
    let i = start + 8;
    let content = '';
    while (i < html.length) {
      if (html[i] === '"' && html[i - 1] !== '\\') break;
      content += html[i];
      i++;
    }
    content = content
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    slides.push(content);
    pos = i + 1;
  }
  return slides;
}

async function run() {
  const html   = fs.readFileSync(HTML, 'utf8');
  const slides = extractSrcdocs(html);
  console.log(`Found ${slides.length} slides in: ${HTML}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none', '--disable-web-security'],
  });

  const screenshots = [];

  for (let i = 0; i < slides.length; i++) {
    process.stdout.write(`  Slide ${i + 1}/${slides.length}...\r`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 }); // 2× = retina quality
    await page.setContent(slides[i], { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForTimeout(2500); // allow web fonts (Google Fonts, Font Awesome) to render
    const el  = await page.$('.slide-container');
    const buf = await el.screenshot({ type: 'png', omitBackground: false });
    screenshots.push(buf);
    await page.close();
  }

  await browser.close();
  console.log('\nBuilding PDF...');

  const pdf = await PDFDocument.create();
  for (const buf of screenshots) {
    const img = await pdf.embedPng(buf);
    const pg  = pdf.addPage([1280, 720]);
    pg.drawImage(img, { x: 0, y: 0, width: 1280, height: 720 });
  }

  fs.writeFileSync(OUT, await pdf.save());
  console.log(`Saved → ${OUT}`);
}

run().catch(err => { console.error(err); process.exit(1); });
