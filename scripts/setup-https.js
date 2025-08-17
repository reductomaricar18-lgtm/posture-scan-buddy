import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const certsDir = path.join(process.cwd(), 'certs');

// Create certs directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

console.log('🔐 Setting up HTTPS certificates for mobile testing...\n');

try {
  // Generate self-signed certificate
  const keyPath = path.join(certsDir, 'key.pem');
  const certPath = path.join(certsDir, 'cert.pem');

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.log('📜 Generating self-signed SSL certificate...');
    
    // Generate private key
    execSync(`openssl genrsa -out "${keyPath}" 2048`, { stdio: 'inherit' });
    
    // Generate certificate
    execSync(`openssl req -new -x509 -key "${keyPath}" -out "${certPath}" -days 365 -subj "/C=US/ST=Dev/L=Local/O=PostureScan/CN=localhost"`, { stdio: 'inherit' });
    
    console.log('✅ SSL certificates generated successfully!');
  } else {
    console.log('✅ SSL certificates already exist!');
  }

  console.log('\n📱 Mobile Testing Setup Complete!');
  console.log('\n🚀 To test on your phone:');
  console.log('1. Run: npm run dev:mobile');
  console.log('2. Find your computer\'s IP address');
  console.log('3. On your phone, visit: https://YOUR_IP:3000');
  console.log('4. Accept the security warning (self-signed certificate)');
  console.log('\n💡 Alternative: Use ngrok for public HTTPS URL');
  console.log('   Run: npm run tunnel');

} catch (error) {
  console.error('❌ Error setting up HTTPS:', error.message);
  console.log('\n🔧 Alternative solutions:');
  console.log('1. Use Vite\'s built-in HTTPS (may show security warnings)');
  console.log('2. Use ngrok for tunneling: npm install -g ngrok');
  console.log('3. Deploy to Vercel/Netlify for testing');
}