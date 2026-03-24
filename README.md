## 🛠️ How to Install (Chrome / Brave / Edge)

Since this extension is not on the Chrome Web Store, you can install it manually in a few easy steps:

1. **Download the code:** Click the green **"Code"** button at the top of this repository and select **"Download ZIP"**.
3. **Open Extensions:** In your browser, go to the address bar and type `chrome://extensions/` (or `edge://extensions/` for Edge) and hit Enter.
4. **Enable Developer Mode:** Toggle the **"Developer mode"** switch in the top right corner.
5. **Load the Extension:** Click the **"Load unpacked"** button in the top left. Select the Zip fi you downloaded, .

That's it! Pin the extension to your toolbar and start taking sticky notes.

# 🦆 DuckyTabs

**Smart audio ducking for focused learning**

DuckyTabs automatically lowers your background music volume when you play learning content (videos, podcasts, courses), then smoothly brings it back up when you pause. No more manual volume juggling!

## ✨ Features

- **🎵 Smart Detection**: Automatically detects when non-music audio starts playing
- **🔄 Smooth Transitions**: Gradual volume fading (800ms) feels natural and professional
- **⚙️ Customizable**: Set your own ducked and normal volume levels
- **🎯 Simple Setup**: Just set one tab as your "music tab" and let it work
- **💡 Visual Feedback**: See when ducking is active with live status indicators
- **🧪 Test Mode**: Preview the duck effect before committing
- **🌙 Beautiful UI**: Modern, gradient-rich interface that's a pleasure to use

## 📦 Installation

### Option 1: Load as Unpacked Extension

1. **Download or clone this repository**
   ```bash
   git clone https://github.com/yourusername/duckytabs.git
   cd duckytabs
   ```

2. **Open Chrome Extensions page**
   - Go to `chrome://extensions/`
   - Or click the puzzle icon → "Manage Extensions"

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `duckytabs` folder
   - You should see the DuckyTabs extension appear!

### Option 2: Package as .crx (For Distribution)

Coming soon to the Chrome Web Store!

## 🚀 How to Use

### Initial Setup

1. **Open your music tab**
   - Start playing music in any tab (YouTube, Spotify Web, SoundCloud, etc.)

2. **Set it as your music tab**
   - Click the DuckyTabs extension icon
   - Click "Set Current Tab as Music"
   - You'll see confirmation: "✅ Music tab set!"

3. **Adjust your preferences**
   - **Ducked Volume**: How loud music plays when learning (default: 20%)
   - **Normal Volume**: How loud music plays normally (default: 100%)

### Daily Usage

Once set up, DuckyTabs works automatically:

1. **Start your music** in the designated music tab
2. **Open learning content** in a different tab (videos, podcasts, courses)
3. **Press play** on your learning content
   - Music automatically ducks to your set volume
   - See the "🦆 Ducking active" indicator
4. **Pause your learning content**
   - Music smoothly returns to normal volume

### Tips & Tricks

- **Test the Effect**: Click "🧪 Test Duck Effect" to preview the volume transition
- **Change Music Tab**: Set a new tab anytime by clicking "Set Current Tab as Music"
- **Clear Music Tab**: Click the "✕" button to reset
- **Disable Temporarily**: Toggle the "Enable Auto-Ducking" switch
- **Multiple Learning Tabs**: You can have multiple learning tabs open - music stays ducked until ALL are paused

## 🎛️ Settings Explained

| Setting | Purpose | Recommended |
|---------|---------|-------------|
| **Ducked Volume** | Background music level during learning | 15-30% |
| **Normal Volume** | Music level when nothing else is playing | 80-100% |
| **Enable Auto-Ducking** | Master on/off switch | On |

## 🔧 Technical Details

### How It Works

1. **Tab Monitoring**: Background service worker listens to all tab audio events
2. **Smart Detection**: Tracks which non-music tabs are playing audio
3. **Volume Control**: Injects scripts to control media element volumes
4. **Smooth Transitions**: Uses 40-step gradient over 800ms for natural fading

### Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave
- ✅ Any Chromium-based browser with Manifest V3 support

### Supported Audio Sources

Works with any HTML5 audio/video element:
- ✅ YouTube
- ✅ Spotify Web Player
- ✅ SoundCloud
- ✅ Coursera, Udemy, Khan Academy
- ✅ Podcast players
- ✅ Netflix, Prime Video (most streaming services)
- ✅ Local HTML5 media

## 🐛 Troubleshooting

### Music doesn't duck

**Possible causes:**
1. Music tab not set correctly
   - Solution: Re-set the music tab
2. Extension disabled
   - Solution: Check the toggle switch is ON
3. No media element found
   - Solution: Ensure the page actually has a `<video>` or `<audio>` element

### Volume changes are choppy

**Possible causes:**
1. Low system performance
   - This is rare but can happen on very old machines
2. Multiple extensions conflicting
   - Solution: Temporarily disable other media-controlling extensions

### Music tab info disappeared

**Possible causes:**
1. Music tab was closed
   - Solution: Set a new music tab
2. Storage was cleared
   - Solution: Re-configure your settings

## 🎨 Customization

Want to modify the extension? Here's what each file does:

- `manifest.json` - Extension configuration
- `background.js` - Core ducking logic and tab monitoring
- `popup.html` - User interface structure
- `popup.js` - UI interactions and settings
- `icon*.png` - Extension icons

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests
- ⭐ Star the repo if you find it useful!

## 📄 License

MIT License - feel free to use and modify!

## 🙏 Credits

Created for learners who want smooth, distraction-free audio control.

---

**Enjoy focused learning with DuckyTabs! 🦆📚**
