import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.resolve();

async function loadWebhookData() {
  try {
    const sampleDataDir = path.join(__dirname, 'server', 'sample-data');
    const files = fs.readdirSync(sampleDataDir);
    
    // Filter only JSON files and sort them to maintain order
    const jsonFiles = files.filter(file => file.endsWith('.json')).sort();
    
    console.log(`📂 Found ${jsonFiles.length} payload files`);
    
    // Start the server first (in development mode, it should already be running)
    const baseUrl = `http://localhost:${process.env.PORT || 6002}`;
    
    // Add delay between requests to simulate real webhook timing
    for (const file of jsonFiles) {
      try {
        console.log(`🔄 Processing ${file}...`);
        
        const filePath = path.join(sampleDataDir, file);
        const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Send to webhook endpoint
        const response = await fetch(`${baseUrl}/api/webhook/process`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        if (response.ok) {
          console.log(`✅ Successfully processed ${file}`);
        } else {
          console.log(`❌ Failed to process ${file}:`, await response.text());
        }
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
    
    console.log('🎯 All webhook payloads processed successfully');
    
  } catch (error) {
    console.error('❌ Error loading webhook data:', error);
  }
}

// Check if server is running first
async function checkServer() {
  const baseUrl = `http://localhost:${process.env.PORT || 6002}`;
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  const isServerRunning = await checkServer();
  
  if (!isServerRunning) {
    console.log('❌ Server is not running. Please start the server first with: npm run server');
    process.exit(1);
  }
  
  await loadWebhookData();
  process.exit(0);
}

main();
