import { spawn } from 'child_process';
import { execSync } from 'child_process';

console.log('🌐 Setting up secure tunnel for mobile testing...\n');

// Check if ngrok is installed
try {
  execSync('ngrok version', { stdio: 'pipe' });
  console.log('✅ ngrok is installed');
} catch (error) {
  console.log('❌ ngrok not found. Installing...');
  try {
    execSync('npm install -g ngrok', { stdio: 'inherit' });
    console.log('✅ ngrok installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install ngrok. Please install manually:');
    console.log('   npm install -g ngrok');
    console.log('   or download from: https://ngrok.com/download');
    process.exit(1);
  }
}

console.log('\n🚀 Starting development server and tunnel...\n');

// Start the development server
const devServer = spawn('npm', ['run', 'dev:mobile'], {
  stdio: 'inherit',
  shell: true
});

// Wait a moment for the server to start
setTimeout(() => {
  console.log('\n🌐 Starting ngrok tunnel...');
  
  // Start ngrok tunnel
  const tunnel = spawn('ngrok', ['http', '3000'], {
    stdio: 'inherit',
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    devServer.kill();
    tunnel.kill();
    process.exit(0);
  });

}, 3000);

console.log('\n📱 Once ngrok starts:');
console.log('1. Copy the HTTPS URL from ngrok (e.g., https://abc123.ngrok.io)');
console.log('2. Open this URL on your phone');
console.log('3. Test the camera functionality');
console.log('\n⚠️  Note: Free ngrok URLs expire after 2 hours');