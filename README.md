# TQWA Web - Quran Radio Streaming Player

A modern, multi-language Quran radio web player for **Adqfm Radio** (إذاعة على ضفاف القرآن). Stream Quran recitations from multiple renowned reciters with support for online/offline modes, track downloads, and 15+ languages.

## 🌟 Features

### 🎵 Quran Streaming
- **8 Renowned Reciters**: Mahmoud Khalil Al-Husary, Muhammad Mahmoud Al-Tablawi, Muhammad Siddiq Al-Minshawi, Abdul Basit Abdus Samad, Mahmoud Ali Al-Banna, Muhammad Ayyub, Saad Al-Ghamdi, plus Random mode
- **M3U Playlist Streaming**: Loads tracks from remote M3U playlists with automatic format handling
- **Scheduled Stream Mode**: Calculates current track based on scheduled broadcast time
- **Playlist Mode**: Manual track-by-track navigation with next/previous controls

### 🌍 Multi-Language Support (15 Languages)
| Language | Code | UI Direction |
|----------|------|--------------|
| Arabic | `ar` | RTL (Default) |
| English | `en` | LTR |
| Turkish | `tr` | LTR |
| German | `de` | LTR |
| French | `fr` | LTR |
| Hindi | `hi` | LTR |
| Indonesian | `id` | LTR |
| Italian | `it` | LTR |
| Japanese | `ja` | LTR |
| Korean | `ko` | LTR |
| Dutch | `nl` | LTR |
| Portuguese | `pt` | LTR |
| Russian | `ru` | LTR |
| Swahili | `sw` | LTR |
| Chinese (Simplified) | `zh` | LTR |

### 📱 Platform Features
- **Online/Offline Mode**: Toggle between streaming and locally downloaded tracks
- **Download Mode**: Download individual tracks or all tracks for a reciter (Android WebView)
- **Android WebView Integration**: Native media player delegation, background playback, media notifications
- **Responsive Design**: Works on mobile, tablet, and desktop

### 🎨 UI/UX
- RTL/LRT automatic layout switching
- Beautiful Islamic-inspired design with gold/green color palette
- Smooth animations and transitions
- Accessibility support (focus states, keyboard navigation)
- Dark theme optimized for night reading

## 📁 Project Structure

```
TQWAwebV1/
├── index.html          # Main HTML structure (dual-container: player + about)
├── script.js           # Core application logic (~1600 lines)
├── styles.css          # Complete styling (~1500 lines)
├── tracks/             # Local M3U playlist files (8 reciters)
│   ├── out-put.m3u                    # Random mode
│   ├── الحصري-.m3u                    # Al-Husary
│   ├── الطبلاوي-.m3u                  # Al-Tablawi
│   ├── المنشاوي-.m3u                  # Al-Minshawi
│   ├── عبد-الباسط.m3u                # Abdul Basit
│   ├── محمود-البنا.m3u                # Al-Banna
│   ├── محمد أيوب.m3u                  # Muhammad Ayyub
│   └── سعد الغامدي.m3u               # Saad Al-Ghamdi
├── translations/       # Translation JSON files (15 languages)
│   ├── translated_en_main.json
│   ├── translated_en_translation_de.json
│   ├── translated_en_translation_fr.json
│   ├── translated_en_translation_hi.json
│   ├── translated_en_translation_id.json
│   ├── translated_en_translation_it.json
│   ├── translated_en_translation_ja.json
│   ├── translated_en_translation_ko.json
│   ├── translated_en_translation_nl.json
│   ├── translated_en_translation_pt.json
│   ├── translated_en_translation_ru.json
│   ├── translated_en_translation_sw.json
│   ├── translated_en_translation_tr.json
│   └── translated_en_translation_zh-cn.json
└── icons/              # SVG icons for UI controls
```

## 🚀 Quick Start

### Web Deployment
Simply serve the files via any static web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### Android WebView Integration
The app detects Android WebView via `typeof Android !== 'undefined'` and enables:
- Native audio playback via `Android.playAudio()`
- Background playback with media controls
- Track downloads to device storage
- Network state detection (auto-switch online/offline)
- External link handling (Google Play, website)

Required Android interface methods:
```java
// Audio
Android.playAudio(url, trackName, duration, startTime)
Android.pauseAudio()
Android.resumeAudio()
Android.stopAudio()

// Downloads
Android.downloadTrack(trackId, url, trackName)
Android.deleteTrack(trackId)
Android.isTrackDownloaded(trackId)
Android.getLocalTrackPath(trackId)

// System
Android.showToast(message)
Android.openInBrowser(url)
Android.openGooglePlay(packageName)
Android.loadAssetFile(path)
```

## ⚙️ Configuration

### Stream Source
Update `m3uLinks` in `script.js` to point to your M3U playlist URLs:
```javascript
const m3uLinks = {
  random: "https://your-cdn.com/random.m3u",
  exclusive: "https://your-cdn.com/husary.m3u",
  // ... other reciters
};
```

### Scheduled Broadcast Time
The stream mode calculates current track based on:
```javascript
const scheduledDateTime = new Date('2025-01-14T04:50:00+03:00');
```
Update this to match your broadcast schedule.

### Translation Files
Translation files are loaded from `translationFiles` URLs (or local assets on Android). Each file maps English keys to target language strings.

## 🎮 Usage

1. **Select a Reciter**: Choose from dropdown (Random or specific reciter)
2. **Choose Language**: Select from 15 supported languages
3. **Play Modes**:
   - **Stream Mode** (Online): Auto-calculates track based on broadcast schedule
   - **Playlist Mode**: Manual track selection with next/prev controls
4. **Offline Mode**: Toggle via menu (☰) → downloads only show cached tracks
5. **Download Tracks**: Enable Download Mode (☰) → click download icon per track or "Download All"

## 🔧 Technical Details

### Key Components
- **`loadTracks(url)`**: Parses M3U playlists, handles both web fetch and Android asset loading
- **`calculateTrackToPlay()`**: Computes current track from scheduled start time
- **`playTrack()`**: Handles playback with format fallbacks (OGG→MP3→M4A), Apple device compatibility
- **`translateUI(lang)`**: Applies translations to all `[data-translate]` elements
- **Download System**: State machine (not_downloaded → downloading → downloaded) with progress callbacks

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari (automatic OGG→MP3 conversion)
- Android WebView (API 21+)
- PWA-ready (manifest, service worker compatible)

## 📄 License

This project is part of **Adqfm Radio** (إذاعة على ضفاف القرآن).

## 🔗 Links

- **Website**: [https://adqfm.net/](https://adqfm.net/)
- **Android App**: [Google Play Store](https://play.google.com/store/apps/details?id=com.adqfm.ARFM)
- **Streaming CDN**: [https://www.streamadqfm.store/](https://www.streamadqfm.store/)

---

**Built with ❤️ for the Quran listening community**