import { spawn } from 'child_process';
import { networkInterfaces } from 'os';

console.log('📱 Setting up local HTTPS for mobile testing...\n');

// Get local IP addresses
function getLocalIPs() {
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }
  return results;
}

const localIPs = getLocalIPs();

console.log('🌐 Your local IP addresses:');
localIPs.forEach((ip, index) => {
  console.log(`   ${index + 1}. ${ip}`);
});

console.log('\n🚀 Starting HTTPS development server...\n');

// Start the development server
const devServer = spawn('npm', ['run', 'dev:mobile'], {
  stdio: 'inherit',
  shell: true
});

console.log('\n📱 To test on your phone:');
console.log('1. Connect your phone to the same WiFi network');
console.log('2. Open your phone browser and go to one of these URLs:');

localIPs.forEach((ip, index) => {
  console.log(`   Option ${index + 1}: https://${ip}:3000`);
  console.log(`   Camera Test: https://${ip}:3000?test=camera`);
});

console.log('\n⚠️  Important:');
console.log('- You will see a security warning (self-signed certificate)');
console.log('- Click "Advanced" → "Proceed to site" to continue');
console.log('- This is normal for local HTTPS development');

console.log('\n🔧 Alternative options:');
console.log('1. Deploy to Vercel: npm run build && npx vercel');
console.log('2. Use Netlify Drop: Build and drag dist folder to netlify.com/drop');
console.log('3. Set up ngrok account for clean tunneling');

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  devServer.kill();
  process.exit(0);
});