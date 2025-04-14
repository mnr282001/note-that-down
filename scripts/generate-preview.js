const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePreview() {
  console.log('Starting preview generation...');
  
  // Ensure the public directory exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport to a standard size
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2, // For higher resolution
    });
    
    // Navigate to the coming soon page
    // For local development, use the local server
    // For production, use the actual URL
    const url = process.env.NODE_ENV === 'production' 
      ? 'https://note-that-down.com/coming-soon'
      : 'http://localhost:3000/coming-soon';
    
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Wait for animations to complete
    await page.waitForTimeout(2000);
    
    // Take screenshot
    const outputPath = path.join(publicDir, 'coming-soon-preview.png');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      fullPage: false,
    });
    
    console.log(`Preview image saved to ${outputPath}`);
  } catch (error) {
    console.error('Error generating preview:', error);
  } finally {
    await browser.close();
  }
}

// Run the function
generatePreview(); 