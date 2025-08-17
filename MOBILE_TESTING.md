# 📱 Mobile Camera Testing Guide

This guide provides multiple ways to test the camera functionality on your phone with HTTPS.

## 🚀 Quick Start Options

### Option 1: Local HTTPS Development (Recommended)

1. **Start HTTPS development server:**
   ```bash
   npm run dev:mobile
   ```

2. **Find your computer's IP address:**
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr show`

3. **Access on your phone:**
   - Open browser on your phone
   - Go to: `https://YOUR_IP_ADDRESS:3000`
   - Accept the security warning (self-signed certificate)

### Option 2: Using ngrok Tunnel (Easiest)

1. **Install and start tunnel:**
   ```bash
   npm run tunnel
   ```

2. **Copy the HTTPS URL from ngrok output**
   - Example: `https://abc123.ngrok.io`

3. **Open the URL on your phone**
   - No security warnings
   - Works from anywhere

### Option 3: Deploy to Vercel (Most Reliable)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

3. **Access the provided URL on your phone**

### Option 4: Deploy to Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)**

3. **Access the provided URL on your phone**

## 🔧 Setup Scripts

### Generate SSL Certificates (if needed)
```bash
npm run setup-certs
```

### Available Commands
```bash
npm run dev          # Regular development
npm run dev:https    # HTTPS development
npm run dev:mobile   # Mobile-optimized HTTPS
npm run tunnel       # Start with ngrok tunnel
npm run setup-certs  # Generate SSL certificates
```

## 📱 Testing Checklist

### Camera Functionality Tests:
- [ ] Camera permission request appears
- [ ] Back camera activates (not front camera)
- [ ] High resolution capture (check resolution display)
- [ ] Back body detection works (green/red status)
- [ ] Capture only works when back body detected
- [ ] Image quality is high (12-20MP equivalent)
- [ ] CNN analysis runs after capture
- [ ] Results display properly

### Device Compatibility Tests:
- [ ] Mobile device detection works
- [ ] Desktop/laptop access is blocked
- [ ] Error messages are clear
- [ ] Requirements are displayed

### Network Tests:
- [ ] HTTPS connection is secure
- [ ] Camera permissions work over HTTPS
- [ ] No mixed content warnings
- [ ] Fast loading on mobile network

## 🛠️ Troubleshooting

### Camera Not Working?
1. **Check HTTPS:** Camera requires HTTPS connection
2. **Check Permissions:** Allow camera access in browser
3. **Check Device:** Must be mobile device with back camera
4. **Check Resolution:** Camera must support high resolution

### HTTPS Issues?
1. **Self-signed certificate:** Accept security warning
2. **Use ngrok:** For clean HTTPS without warnings
3. **Deploy online:** Use Vercel/Netlify for production HTTPS

### Connection Issues?
1. **Same network:** Phone and computer on same WiFi
2. **Firewall:** Check if port 3000 is blocked
3. **IP address:** Make sure you're using correct IP

## 🌐 Network Requirements

### Local Testing:
- Phone and computer on same WiFi network
- Port 3000 accessible
- HTTPS enabled

### Tunnel Testing:
- Internet connection required
- ngrok account (free tier available)
- No network restrictions needed

### Online Testing:
- Internet connection required
- No local network setup needed
- Most reliable option

## 📊 Performance Tips

### For Best Results:
1. **Use good lighting** for back body detection
2. **Stable internet** for CNN processing
3. **Modern mobile browser** (Chrome/Safari)
4. **Clear background** for better detection
5. **Form-fitting clothes** for accurate analysis

## 🔒 Security Notes

### Local HTTPS:
- Self-signed certificates (browser warnings normal)
- Only accessible on local network
- Development use only

### Tunnel/Deploy:
- Public HTTPS (no warnings)
- Accessible from anywhere
- Suitable for testing and production

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify camera permissions
3. Test on different mobile browsers
4. Try different testing methods above

---

**Ready to test?** Start with `npm run tunnel` for the easiest setup! 🚀