import { spawn, execSync } from 'child_process';

console.log('🚀 Deploying to Vercel for mobile testing...\n');

try {
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI is installed');
  } catch (error) {
    console.log('📦 Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully');
  }

  console.log('🔨 Building the project...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');

  console.log('\n🌐 Deploying to Vercel...');
  console.log('📝 You may need to:');
  console.log('   1. Sign in to Vercel (if first time)');
  console.log('   2. Choose your deployment settings');
  console.log('   3. Wait for deployment to complete');

  // Deploy to Vercel
  const deploy = spawn('vercel', ['--prod'], {
    stdio: 'inherit',
    shell: true
  });

  deploy.on('close', (code) => {
    if (code === 0) {
      console.log('\n🎉 Deployment successful!');
      console.log('\n📱 To test on your phone:');
      console.log('1. Copy the deployment URL from above');
      console.log('2. Open it on your phone browser');
      console.log('3. Add ?test=camera to test camera directly');
      console.log('\n✅ No security warnings - production HTTPS!');
    } else {
      console.log('\n❌ Deployment failed. Try manual deployment:');
      console.log('   1. Run: npm run build');
      console.log('   2. Run: npx vercel --prod');
      console.log('   3. Follow the prompts');
    }
  });

} catch (error) {
  console.error('❌ Error during deployment:', error.message);
  console.log('\n🔧 Manual deployment steps:');
  console.log('1. npm run build');
  console.log('2. npx vercel --prod');
  console.log('3. Follow the Vercel setup prompts');
}