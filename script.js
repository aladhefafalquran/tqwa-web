// Configuration variables
const scheduledDateTime = new Date('2025-01-14T04:50:00+03:00');

// Detect if running in Android WebView
const isAndroid = typeof Android !== 'undefined';

// Asset file paths for Android (without file:/// prefix)
const m3uLinks = isAndroid ? {
  random: "tracks/out-put.m3u",
  exclusive: "tracks/الحصري-.m3u",
  tobalawi: "tracks/الطبلاوي-.m3u",
  manshawi: "tracks/المنشاوي-.m3u",
  abdbasat: "tracks/عبد-الباسط.m3u",
  mahmoudbanna: "tracks/محمود-البنا.m3u",
  mahmoudeyup: "tracks/محمد أيوب.m3u",
  SaadAlGhamdi: "tracks/سعد الغامدي.m3u"
} : {
  random: "https://www.streamadqfm.store/out-put.m3u",
  exclusive: "https://www.streamadqfm.store/%D8%A7%D9%84%D8%AD%D8%B5%D8%B1%D9%8A-.m3u",
  tobalawi: "https://www.streamadqfm.store/%D8%A7%D9%84%D8%B7%D8%A8%D9%84%D8%A7%D9%88%D9%8A-.m3u",
  manshawi: "https://www.streamadqfm.store/%D8%A7%D9%84%D9%85%D9%86%D8%B4%D8%A7%D9%88%D9%8A-.m3u",
  abdbasat: "https://www.streamadqfm.store/%D8%B9%D8%A8%D8%AF-%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7.m3u",
  mahmoudbanna: "https://www.streamadqfm.store/%D9%85%D8%AD%D9%85%D9%88%D8%AF-%D8%A7%D9%84%D8%A8%D9%86%D8%A7.m3u",
  mahmoudeyup: "https://www.streamadqfm.store/%D9%85%D8%AD%D9%85%D8%AF%20%D8%A3%D9%8A%D9%88%D8%A8.m3u",
  SaadAlGhamdi: "https://www.streamadqfm.store/%D8%B3%D8%B9%D8%AF%20%D8%A7%D9%84%D8%BA%D8%A7%D9%85%D8%AF%D9%8A.m3u"
};

const translationFiles = isAndroid ? {
  en: "translations/translated_en_main.json",
  de: "translations/translated_en_translation_de.json",
  fr: "translations/translated_en_translation_fr.json",
  hi: "translations/translated_en_translation_hi.json",
  id: "translations/translated_en_translation_id.json",
  it: "translations/translated_en_translation_it.json",
  ja: "translations/translated_en_translation_ja.json",
  ko: "translations/translated_en_translation_ko.json",
  nl: "translations/translated_en_translation_nl.json",
  pt: "translations/translated_en_translation_pt.json",
  ru: "translations/translated_en_translation_ru.json",
  sw: "translations/translated_en_translation_sw.json",
  tr: "translations/translated_en_translation_tr.json",
  zh: "translations/translated_en_translation_zh-cn.json"
} : {
  en: "https://www.streamadqfm.store/translated/en/main.json",
  de: "https://www.streamadqfm.store/translated/en/translation_de.json",
  fr: "https://www.streamadqfm.store/translated/en/translation_fr.json",
  hi: "https://www.streamadqfm.store/translated/en/translation_hi.json",
  id: "https://www.streamadqfm.store/translated/en/translation_id.json",
  it: "https://www.streamadqfm.store/translated/en/translation_it.json",
  ja: "https://www.streamadqfm.store/translated/en/translation_ja.json",
  ko: "https://www.streamadqfm.store/translated/en/translation_ko.json",
  nl: "https://www.streamadqfm.store/translated/en/translation_nl.json",
  pt: "https://www.streamadqfm.store/translated/en/translation_pt.json",
  ru: "https://www.streamadqfm.store/translated/en/translation_ru.json",
  sw: "https://www.streamadqfm.store/translated/en/translation_sw.json",
  tr: "https://www.streamadqfm.store/translated/en/translation_tr.json",
  zh: "https://www.streamadqfm.store/translated/en/translation_zh-cn.json"
};

// Global variables
let tracks = [];
let isTracksReady = false;
let currentTrackIndex = 0;
let currentReader = '';
let isPlaying = false;
let isPaused = false;
let isStreamMode = false; // true when using calculateTrackToPlay (stream mode)
let translations = {};
let isTranslated = false;
let retryCount = 0;
const MAX_RETRIES = 3;

// Menu state variables
let isMenuOpen = false;
let isOnlineMode = localStorage.getItem('onlineMode') === 'true' || localStorage.getItem('onlineMode') === null; // Default to true (online)
let isDownloadMode = false; // Does not persist, resets on reload

// Fallback translations for essential texts
const fallbackTranslations = {
  'about_thank_you': {
    'en': 'Thank you for choosing Adqfm Radio - Your companion in the journey of the Holy Quran',
    'de': 'Vielen Dank, dass Sie Adqfm Radio gewählt haben - Ihr Begleiter auf der Reise des Heiligen Korans',
    'fr': 'Merci d\'avoir choisi Adqfm Radio - Votre compagnon dans le voyage du Saint Coran',
    'hi': 'अदक़फम रेडियो चुनने के लिए धन्यवाद - पवित्र कुरान की यात्रा में आपका साथी',
    'id': 'Terima kasih telah memilih Radio Adqfm - Pendamping Anda dalam perjalanan Al-Quran',
    'it': 'Grazie per aver scelto Radio Adqfm - Il vostro compagno nel viaggio del Santo Corano',
    'ja': 'Adqfmラジオをお選びいただきありがとうございます - 聖クルアーンの旅のお供',
    'ko': 'Adqfm 라디오를 선택해 주셔서 감사합니다 - 성 꾸란 여행의 동반자',
    'nl': 'Dank je voor het kiezen van Adqfm Radio - Je metgezel op de reis van de Heilige Koran',
    'pt': 'Obrigado por escolher a Rádio Adqfm - Seu companheiro na jornada do Sagrado Alcorão',
    'ru': 'Спасибо за выбор радио Adqfm - Ваш спутник в путешествии по Священному Корану',
    'sw': 'Asante kwa kuchagua Redio ya Adqfm - Mwenzako katika safari ya Qurani Takatifu',
    'tr': 'Adqfm Radyo\'yu seçtiğiniz için teşekkürler - Kutsal Kuran yolculuğunuzda rehberiniz',
    'zh': '感谢您选择Adqfm电台 - 您在神圣古兰经旅程中的伙伴'
  },
  'تستمعون الى:': {
    'en': 'You are listening to:',
    'de': 'Sie hören:',
    'fr': 'Vous écoutez:',
    'hi': 'आप सुन रहे हैं:',
    'id': 'Anda sedang mendengarkan:',
    'it': 'State ascoltando:',
    'ja': 'お聞きになっているのは:',
    'ko': '듣고 계신 것은:',
    'nl': 'U luistert naar:',
    'pt': 'Você está ouvindo:',
    'ru': 'Вы слушаете:',
    'sw': 'Mnasikiliza:',
    'tr': 'Dinlediğiniz:',
    'zh': '您正在收听:'
  },
  'جاري التجهيز...': {
    'en': 'Preparing...',
    'de': 'Vorbereitung...',
    'fr': 'Préparation...',
    'hi': 'तैयार हो रहा है...',
    'id': 'Mempersiapkan...',
    'it': 'Preparazione...',
    'ja': '準備中...',
    'ko': '준비 중...',
    'nl': 'Voorbereiden...',
    'pt': 'Preparando...',
    'ru': 'Подготовка...',
    'sw': 'Inaandaa...',
    'tr': 'Hazırlanıyor...',
    'zh': '准备中...'
  }
};

// Check if the current device is an Apple device
const isAppleDevice = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
console.log("Is Apple device:", isAppleDevice);

// Load language preference from localStorage
const savedLanguage = localStorage.getItem('language') || 'ar';
isTranslated = savedLanguage !== 'ar';

/**
 * Show loading state
 */
function showLoading() {
  const spinner = document.getElementById('loadingSpinner');
  const trackList = document.getElementById('trackList');
  const currentTrack = document.getElementById('currentTrack');
  
  spinner.style.display = 'block';
  trackList.style.display = 'none';
  currentTrack.textContent = translations['جاري التجهيز...'] || 'جاري التجهيز...';
}

/**
 * Hide loading state
 */
function hideLoading() {
  const spinner = document.getElementById('loadingSpinner');
  const trackList = document.getElementById('trackList');
  
  spinner.style.display = 'none';
  trackList.style.display = 'block';
}

/**
 * Show error message
 */
function showError(message) {
  const currentTrack = document.getElementById('currentTrack');
  const trackList = document.getElementById('trackList');
  
  currentTrack.innerHTML = `❌ ${message}`;
  currentTrack.style.color = '#ff6b6b';
  trackList.style.display = 'none';
  hideLoading();
}

/**
 * Reset error state
 */
function resetError() {
  const currentTrack = document.getElementById('currentTrack');
  currentTrack.style.color = '';
}

/**
 * Properly encodes URL to handle special characters and Arabic text
 * @param {string} url - The URL to encode
 * @returns {string} - The encoded URL
 */
function encodeAudioUrl(url) {
  try {
    // First, break the URL into parts (protocol, domain, path)
    const urlObj = new URL(url);
    const baseUrl = urlObj.origin; // This gives us https://www.streamadqfm.store
    let pathParts = urlObj.pathname.split('/').filter(part => part !== '');
    
    // Encode each path part individually
    const encodedPathParts = pathParts.map(part => {
      // First try to decode in case it's already encoded
      try {
        const decoded = decodeURIComponent(part);
        return encodeURIComponent(decoded);
      } catch (e) {
        // If decoding fails, it might be partially encoded or not encoded at all
        return encodeURIComponent(part);
      }
    });
    
    // Reassemble the URL
    return `${baseUrl}/${encodedPathParts.join('/')}`;
  } catch (e) {
    console.error("Error encoding URL:", e);
    // If there's an error in encoding, return the original URL
    return url;
  }
}

/**
 * Loads tracks from M3U playlist URL
 * @param {string} url - The URL of the M3U playlist
 * @returns {Promise<boolean>} - Success status
 */
async function loadTracks(url) {
  showLoading();
  resetError();

  try {
    let text;

    // If Android, load from assets using Java bridge
    if (isAndroid && Android.loadAssetFile) {
      console.log('Loading from Android assets:', url);
      text = Android.loadAssetFile(url);
      if (!text) throw new Error('فشل تحميل الملف من الأصول');
    } else {
      // Web browser: use fetch
      const response = await fetch(url);
      if (!response.ok) throw new Error(`خطأ في الشبكة: ${response.status}`);
      text = await response.text();
    }
    const lines = text.split("\n").filter(line => line.trim() !== "");
    tracks = [];
    let tempTrack = null;
    
    for (const line of lines) {
      if (line.startsWith("#EXTINF:")) {
        const parts = line.slice(8).split(",");
        const duration = Math.max(parseFloat(parts[0]) || 1800, 0);
        const name = parts[1]?.trim() || "مقطع غير معروف";
        tempTrack = { duration, name };
      } else if (tempTrack && !line.startsWith("#")) {
        tempTrack.url = line.trim();
        tracks.push(tempTrack);
        tempTrack = null;
      }
    }
    
    isTracksReady = tracks.length > 0;
    
    if (isTracksReady) {
      displayTrackList();
      hideLoading();
      
      // Update current track display
      const currentTrackDiv = document.getElementById("currentTrack");
      const readyText = isTranslated ? 
        (translations['جاهز للتشغيل'] || 'Ready to play') : 
        '🎵 جاهز للتشغيل';
      currentTrackDiv.textContent = readyText;
    } else {
      throw new Error('لم يتم العثور على مقاطع صوتية');
    }
    
    return true;
  } catch (error) {
    console.error('Error in loadTracks:', error);
    isTracksReady = false;
    tracks = [];
    
    const errorMsg = isTranslated ? 
      (translations['فشل في تحميل المقاطع'] || 'Failed to load tracks') : 
      `فشل في تحميل المقاطع: ${error.message}`;
    showError(errorMsg);
    
    return false;
  }
}

/**
 * Displays the track list in the UI
 */
function displayTrackList() {
  const trackListDiv = document.getElementById('trackList');

  if (tracks.length === 0) {
    trackListDiv.innerHTML = `<div class="trackItem">📂 ${translations['لا توجد مقاطع متاحة'] || 'لا توجد مقاطع متاحة'}</div>`;
    return;
  }

  // Don't show download arrows in random mode
  const showDownloadArrows = isDownloadMode && currentReader !== 'random';

  trackListDiv.innerHTML = tracks.map((track, index) => `
    <div class="trackItem ${index === currentTrackIndex ? 'active' : ''}" onclick="playTrack(${index})" title="${translations[track.name] || track.name}">
      🎵 ${translations[track.name] || track.name}
      <img src="icons/arrow-down-solid-full.svg" alt="Download" class="download-arrow ${showDownloadArrows ? 'visible' : ''}" onclick="handleDownloadClick(event, ${index});">
    </div>
  `).join('');

  // Initialize download states and update UI
  if (isAndroid) {
    initializeDownloadStates();
    updateDownloadUI();
  }
}

/**
 * Loads translations for a specific language
 * @param {string} lang - Language code
 */
async function loadTranslations(lang = 'en') {
  if (lang === 'ar') {
    translations = {};
    return;
  }

  const url = translationFiles[lang];
  if (!url) {
    console.error(`Translation file for language '${lang}' not found.`);
    return;
  }

  try {
    let jsonText;

    // If Android, load from assets using Java bridge
    if (isAndroid && Android.loadAssetFile) {
      console.log('Loading translations from Android assets:', url);
      jsonText = Android.loadAssetFile(url);
      if (!jsonText) throw new Error('Failed to load translation file from assets');
      translations = JSON.parse(jsonText);
    } else {
      // Web browser: use fetch
      const response = await fetch(`${url}?v=${new Date().getTime()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      translations = await response.json();
    }

    console.log(`Translations loaded for language: ${lang}`, translations);
  } catch (error) {
    console.error(`Error loading translations for language '${lang}':`, error);
    translations = {};
  }
}

/**
 * Translates the UI elements based on the selected language
 * @param {string} lang - Language code
 */
function translateUI(lang = 'ar') {
  // Set document direction immediately
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  
  // Apply body direction class
  document.body.classList.remove('rtl', 'ltr');
  document.body.classList.add(lang === 'ar' ? 'rtl' : 'ltr');
  
  // Translate all elements with data-translate attribute
  const elementsToTranslate = document.querySelectorAll('[data-translate]');
  elementsToTranslate.forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[key] && lang !== 'ar') {
      element.textContent = translations[key];
    } else {
      element.textContent = element.getAttribute('data-ar');
    }
  });

  // Update track list
  displayTrackList();

  // Update current track display if it contains listening info
  const currentTrackDiv = document.getElementById("currentTrack");
  if (currentTrackDiv && (currentTrackDiv.textContent.includes("تستمعون الى:") || currentTrackDiv.textContent.includes("You are listening to:"))) {
    const trackName = currentTrackDiv.textContent.split(":")[1]?.trim();
    if (trackName) {
      const nowPlayingText = lang === 'ar' ? '📻 تستمعون الى:' : `📻 ${translations['تستمعون الى:'] || 'You are listening to:'}`;
      currentTrackDiv.textContent = `${nowPlayingText} ${translations[trackName] || trackName}`;
    }
  }

  // Update about text direction and alignment
  const aboutElements = document.querySelectorAll('.about-intro, .features-section, .programs-section, .contact-section');
  aboutElements.forEach(element => {
    if (lang === 'ar') {
      element.classList.add('rtl');
      element.classList.remove('ltr');
    } else {
      element.classList.add('ltr');
      element.classList.remove('rtl');
    }
  });

  // Update language selector alignment
  const languageSelect = document.querySelector('.language-select');
  if (languageSelect) {
    if (lang === 'ar') {
      languageSelect.style.justifyContent = 'flex-start';
    } else {
      languageSelect.style.justifyContent = 'flex-end';
    }
  }
}

/**
 * Calculates which track to play based on the current time (Stream Mode)
 */
function calculateTrackToPlay() {
  const now = new Date();
  const button = document.getElementById('playButton');
  const loadingText = translations['جاري التجهيز...'] || 'جاري التجهيز...';

  // Update button text
  const originalText = button.textContent;
  button.textContent = `⏳ ${loadingText}`;
  button.disabled = true;

  if (!isTracksReady || tracks.length === 0) {
    console.error('Tracks not ready or empty');
    const alertMsg = translations['يرجى انتظار تحميل المقاطع'] || 'يرجى انتظار تحميل المقاطع';
    alert(alertMsg);
    button.textContent = originalText;
    button.disabled = false;
    return;
  }

  // Check if we're resuming from pause
  if (!isPlaying && isPaused) {
    console.log('Resuming playback from pause');
    if (isAndroid && Android.pauseAudio) {
      Android.pauseAudio(); // This toggles pause/resume in MediaPlayerService
    }
    button.textContent = originalText;
    button.disabled = false;
    return;
  }

  // In offline mode, just play from the first track (only if not already playing)
  if (!isOnlineMode) {
    console.log('Offline mode: Playing from first track');
    isStreamMode = false;
    setTimeout(() => {
      playTrack(0, 0, false);
      button.textContent = originalText;
      button.disabled = false;
    }, 500);
    return;
  }

  // Enable stream mode for online mode
  isStreamMode = true;

  const totalDuration = tracks.reduce((acc, track) => acc + track.duration, 0);
  const elapsedSeconds = Math.floor((now - scheduledDateTime) / 1000);

  console.log('Total duration:', totalDuration, 'Elapsed seconds:', elapsedSeconds);

  let remainingTime = elapsedSeconds % totalDuration;
  let accumulatedTime = 0;

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    accumulatedTime += track.duration;

    if (remainingTime < accumulatedTime) {
      const trackOffset = remainingTime - (accumulatedTime - track.duration);
      currentTrackIndex = i;

      console.log(`Playing track ${i} (${track.name}) from ${trackOffset}s in STREAM MODE`);

      setTimeout(() => {
        playTrack(i, trackOffset, false);
        button.textContent = originalText;
        button.disabled = false;
      }, 1000);
      return;
    }
  }

  // Fallback to first track
  setTimeout(() => {
    playTrack(0, 0, false);
    button.textContent = originalText;
    button.disabled = false;
  }, 1000);
}

/**
 * Try alternative audio formats and sources
 * @param {string} baseUrl - The original audio URL
 * @returns {Array} - Array of alternative URLs to try
 */
function getAudioAlternatives(baseUrl) {
  const alternatives = [];
  
  // Try different formats
  if (baseUrl.toLowerCase().endsWith('.ogg')) {
    alternatives.push(baseUrl.replace(/\.ogg$/i, '.mp3'));
    alternatives.push(baseUrl.replace(/\.ogg$/i, '.m4a'));
  } else if (baseUrl.toLowerCase().endsWith('.mp3')) {
    alternatives.push(baseUrl.replace(/\.mp3$/i, '.ogg'));
    alternatives.push(baseUrl.replace(/\.mp3$/i, '.m4a'));
  } else if (baseUrl.toLowerCase().endsWith('.m4a')) {
    alternatives.push(baseUrl.replace(/\.m4a$/i, '.mp3'));
    alternatives.push(baseUrl.replace(/\.m4a$/i, '.ogg'));
  }
  
  return alternatives;
}

/**
 * Plays a specific track
 * @param {number} index - Track index
 * @param {number} startTime - Start time in seconds
 * @param {boolean} isRandom - Whether it's a random track
 * @param {number} retryAttempt - Current retry attempt number
 * @param {Array} alternativeUrls - Alternative URLs to try
 */
function playTrack(index, startTime = 0, isRandom = false, retryAttempt = 0, alternativeUrls = []) {
  const audioPlayer = document.getElementById("audioPlayer");
  const currentTrackDiv = document.getElementById("currentTrack");

  // Reset retry count for a new track
  if (retryAttempt === 0) {
    retryCount = 0;
    resetError();
  }

  if (!tracks[index]) {
    console.error(`Invalid track index: ${index}`);
    showError(translations['مقطع غير صالح'] || 'مقطع غير صالح');
    return;
  }

  const track = tracks[index];
  currentTrackIndex = index;
  isPlaying = true;

  // Get appropriate URL based on device
  let audioUrl;
  let isLocalFile = false;

  // Check if track is downloaded locally (Android only)
  if (isAndroid && Android.getLocalTrackPath) {
    const trackId = getTrackId(currentReader, track.name);
    const localPath = Android.getLocalTrackPath(trackId);

    if (localPath) {
      audioUrl = 'file://' + localPath;
      isLocalFile = true;
      console.log(`Playing from local storage: ${audioUrl}`);
    }
  }

  // If not playing from local file, use remote URL
  if (!isLocalFile) {
    // If we're retrying with alternative URLs
    if (alternativeUrls.length > 0 && retryAttempt < alternativeUrls.length) {
      audioUrl = alternativeUrls[retryAttempt];
      console.log(`Retry ${retryAttempt + 1}/${alternativeUrls.length} with alternative URL: ${audioUrl}`);
    } else {
      audioUrl = track.url;

      // For Apple devices, replace OGG with MP3
      if (isAppleDevice && audioUrl.toLowerCase().endsWith('.ogg')) {
        audioUrl = audioUrl.replace(/\.ogg$/i, '.mp3');
        console.log("Apple device detected, using MP3 version:", audioUrl);
      }

      // Encode the URL to handle special characters and Arabic text
      audioUrl = encodeAudioUrl(audioUrl);
    }
  }
  
  console.log(`Playing track: ${track.name} from ${startTime}s`);
  console.log(`URL: ${audioUrl}`);

  // Get translated track name based on current language
  const translatedTrackName = translations[track.name] || track.name;

  // Update the UI with the current track name
  const nowPlayingText = isTranslated ?
    `📻 ${translations['تستمعون الى:'] || 'You are listening to:'}` :
    '📻 تستمعون الى:';
  currentTrackDiv.textContent = `${nowPlayingText} ${translatedTrackName}`;

  // If running in Android, delegate playback to native player
  if (isAndroid && Android.playAudio) {
    console.log('Delegating to Android native player');
    console.log(`Playing: ${translatedTrackName}, URL: ${audioUrl}`);

    // Pass the translated track name to Android for notification
    Android.playAudio(audioUrl, translatedTrackName, Math.floor(track.duration), Math.floor(startTime));

    // Update playback state
    isPlaying = true;
    isPaused = false;
    updatePlayPauseButton(false);

    // Update track list UI
    displayTrackList();
    const activeTrackItem = document.querySelector('.trackItem.active');
    if (activeTrackItem) {
      activeTrackItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Web browser playback
  // Set the audio source
  audioPlayer.src = audioUrl;

  // Set up event handlers
  audioPlayer.onloadedmetadata = () => {
    try {
      audioPlayer.currentTime = startTime;
      audioPlayer.play()
        .catch(err => {
          console.error("Playback error:", err);
          handlePlaybackError(index, startTime, isRandom, retryAttempt, alternativeUrls);
        });
    } catch (e) {
      console.error("Error setting current time:", e);
      handlePlaybackError(index, startTime, isRandom, retryAttempt, alternativeUrls);
    }
  };

  audioPlayer.onended = () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(currentTrackIndex, 0, isRandom);
  };

  audioPlayer.onerror = (e) => {
    console.error("Audio error:", e);
    console.log("Audio error code:", audioPlayer.error ? audioPlayer.error.code : "unknown");
    
    handlePlaybackError(index, startTime, isRandom, retryAttempt, alternativeUrls);
  };

  // Update track list UI
  displayTrackList();

  const activeTrackItem = document.querySelector('.trackItem.active');
  if (activeTrackItem) {
    activeTrackItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Handle playback errors with retries and fallbacks
 * @param {number} index - Track index
 * @param {number} startTime - Start time in seconds
 * @param {boolean} isRandom - Whether it's a random track
 * @param {number} retryAttempt - Current retry attempt
 * @param {Array} alternativeUrls - Alternative URLs to try
 */
function handlePlaybackError(index, startTime, isRandom, retryAttempt, alternativeUrls) {
  const track = tracks[index];
  
  // If we don't have alternative URLs yet, generate them
  if (!alternativeUrls || alternativeUrls.length === 0) {
    alternativeUrls = getAudioAlternatives(track.url);
  }
  
  // If we have alternative URLs to try
  if (retryAttempt < alternativeUrls.length) {
    // Try the next alternative URL
    playTrack(index, startTime, isRandom, retryAttempt + 1, alternativeUrls);
  } else {
    // If we've tried all alternatives, move to the next track
    retryCount++;
    
    // If we've retried too many tracks, pause playback to avoid infinite loops
    if (retryCount > MAX_RETRIES) {
      console.error(`Too many errors (${retryCount}), stopping playback`);
      const audioPlayer = document.getElementById("audioPlayer");
      audioPlayer.pause();
      
      const errorText = isTranslated ? 
        (translations['خطأ في تشغيل المقاطع'] || 'Error playing tracks. Please try again later.') : 
        '❌ حدث خطأ في تشغيل المقطع. يرجى المحاولة مرة أخرى لاحقاً.';
      showError(errorText);
      
      retryCount = 0;
      return;
    }
    
    // Move to the next track
    currentTrackIndex = (index + 1) % tracks.length;
    playTrack(currentTrackIndex, 0, isRandom);
  }
}

/**
 * Loads tracks for the selected reader
 */
async function loadSelectedReader() {
  const select = document.getElementById('readerSelect');
  currentReader = select.value;
  select.disabled = true;
  isTracksReady = false;
  tracks = [];

  const audioPlayer = document.getElementById('audioPlayer');
  if (!isAndroid) {
    audioPlayer.pause();
    audioPlayer.src = '';
  }

  // In offline mode, try to load from cache/assets
  if (!isOnlineMode && isAndroid) {
    console.log('Offline mode: Loading tracks for reader:', currentReader);

    // Try to load the M3U from local assets (Android has M3U files in assets folder)
    try {
      const success = await loadTracks(m3uLinks[currentReader]);
      select.disabled = false;

      if (success) {
        // Filter to show only downloaded tracks for this reader
        loadOfflineTracks();
      } else {
        // If loading failed, show message
        showNoDownloadsMessage();
      }
    } catch (error) {
      console.error('Error loading tracks in offline mode:', error);
      select.disabled = false;
      showNoDownloadsMessage();
    }
    return;
  }

  // Online mode: fetch M3U file normally
  const success = await loadTracks(m3uLinks[currentReader]);
  select.disabled = false;

  if (success && isPlaying) {
    calculateTrackToPlay();
  }
}

/**
 * Toggles between main and about containers
 * @param {number} circleNumber - Circle number (1 or 2)
 */
function toggleCircle(circleNumber) {
  const mainContainer = document.getElementById('mainContainer');
  const secondContainer = document.getElementById('secondContainer');
  const allCircles = document.querySelectorAll('.circle');

  // Remove active class from all circles
  allCircles.forEach(circle => circle.classList.remove('active'));

  if (circleNumber === 2) {
    // Show container2 and hide container
    mainContainer.classList.add('active');
    secondContainer.classList.add('active');
    
    // Set active circle in second container
    const secondContainerCircles = secondContainer.querySelectorAll('.circle');
    if (secondContainerCircles[1]) {
      secondContainerCircles[1].classList.add('active');
    }
  } else {
    // Show container and hide container2
    mainContainer.classList.remove('active');
    secondContainer.classList.remove('active');
    
    // Set active circle in main container
    const mainContainerCircles = mainContainer.querySelectorAll('.circle');
    if (mainContainerCircles[0]) {
      mainContainerCircles[0].classList.add('active');
    }
  }
}

/**
 * Opens the Google Play Store for the app
 */
/**
 * Open website link externally in browser
 */
function openWebsite(event) {
  event.preventDefault();
  const url = "https://adqfm.net/";

  if (isAndroid && Android.openInBrowser) {
    // Open in external browser
    Android.openInBrowser(url);
  } else {
    // Fallback for web
    window.open(url, "_blank");
  }
}

/**
 * Open Google Play link - try app first, fallback to browser
 */
function openGooglePlay(event) {
  event.preventDefault();

  if (isAndroid && Android.openGooglePlay) {
    // Let Android handle it - will try Play Store app first, then browser
    Android.openGooglePlay("com.adqfm.ARFM");
  } else {
    // Fallback for web
    window.open("https://play.google.com/store/apps/details?id=com.adqfm.ARFM", "_blank");
  }
}

/**
 * Toggle burger menu open/close
 */
function toggleBurgerMenu() {
  isMenuOpen = !isMenuOpen;
  const burgerIcon = document.getElementById('burgerIcon');
  const slidingMenu = document.getElementById('slidingMenu');

  if (isMenuOpen) {
    // Open menu - change to X icon
    burgerIcon.src = 'icons/x-solid-full.svg';
    slidingMenu.classList.add('active');
  } else {
    // Close menu - change to bars icon
    burgerIcon.src = 'icons/bars-solid-full.svg';
    slidingMenu.classList.remove('active');
  }
}

/**
 * Toggle online/offline mode
 */
function toggleOnlineMode() {
  isOnlineMode = !isOnlineMode;
  localStorage.setItem('onlineMode', isOnlineMode);
  updateMenuButtonStates();
  updateUIForOfflineMode();

  // Reload track list to show only downloaded tracks in offline mode
  if (!isOnlineMode) {
    // Auto-select first reader if currently on random
    if (currentReader === 'random') {
      const readerSelect = document.getElementById('readerSelect');
      if (readerSelect && readerSelect.options.length > 1) {
        currentReader = readerSelect.options[1].value; // First reader after 'random'
        readerSelect.value = currentReader;
        console.log('Auto-switched to first reader:', currentReader);
      }
    }
    // In offline mode, show only downloaded tracks
    loadOfflineTracks();
  } else {
    // In online mode, reload the current reader's tracks
    if (currentReader) {
      loadSelectedReader();
    }
  }
}

/**
 * Switch to offline mode (called from Android when connection is lost)
 */
function switchToOfflineMode() {
  console.log('Switching to offline mode due to network loss');
  if (isOnlineMode) {
    // Only switch if currently in online mode
    isOnlineMode = false;
    localStorage.setItem('onlineMode', false);
    updateMenuButtonStates();
    updateUIForOfflineMode();
    loadOfflineTracks();
  }
}

/**
 * Switch to online mode (called from Android when connection is restored)
 */
function switchToOnlineMode() {
  console.log('Switching to online mode due to network restoration');
  if (!isOnlineMode) {
    // Only switch if currently in offline mode
    isOnlineMode = true;
    localStorage.setItem('onlineMode', true);
    updateMenuButtonStates();
    updateUIForOfflineMode();
    // Reload current reader's tracks from server
    if (currentReader) {
      loadSelectedReader();
    }
  }
}

/**
 * Toggle download mode
 */
function toggleDownloadMode() {
  isDownloadMode = !isDownloadMode;
  updateMenuButtonStates();

  // Auto-select first reader if entering download mode and currently on random
  if (isDownloadMode && currentReader === 'random') {
    const readerSelect = document.getElementById('readerSelect');
    if (readerSelect && readerSelect.options.length > 1) {
      currentReader = readerSelect.options[1].value; // First reader after 'random'
      readerSelect.value = currentReader;
      console.log('Auto-switched to first reader for download mode:', currentReader);
      loadSelectedReader(); // Load the new reader's tracks
    }
  } else {
    displayTrackList(); // Refresh track list to show/hide download arrows
  }

  // Show/hide download all button
  const downloadAllBtn = document.getElementById('downloadAllBtn');
  if (downloadAllBtn) {
    downloadAllBtn.style.display = isDownloadMode && isAndroid ? 'block' : 'none';
  }
}

/**
 * Update menu button visual states
 */
function updateMenuButtonStates() {
  const onlineOfflineBtn = document.getElementById('onlineOfflineBtn');
  const downloadModeBtn = document.getElementById('downloadModeBtn');

  // Update online/offline button
  if (isOnlineMode) {
    onlineOfflineBtn.classList.add('active');
    onlineOfflineBtn.classList.remove('inactive');
  } else {
    onlineOfflineBtn.classList.remove('active');
    onlineOfflineBtn.classList.add('inactive');
  }

  // Update download mode button
  if (isDownloadMode) {
    downloadModeBtn.classList.add('active');
    downloadModeBtn.classList.remove('inactive');
  } else {
    downloadModeBtn.classList.remove('active');
    downloadModeBtn.classList.add('inactive');
  }
}

// ======= DOWNLOAD FUNCTIONALITY =======

// Download states for each track
const downloadStates = {}; // trackId: { state: 'not_downloaded' | 'downloading' | 'downloaded', progress: 0-100 }

/**
 * Generate unique track ID from reader and track name
 */
function getTrackId(reader, trackName) {
  const sanitized = trackName.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
  return `${reader}_${sanitized}`;
}

/**
 * Initialize download states for current track list
 */
function initializeDownloadStates() {
  if (!isAndroid) return;

  tracks.forEach((track, index) => {
    const trackId = getTrackId(currentReader, track.name);
    if (!downloadStates[trackId]) {
      // Check if track is already downloaded
      const isDownloaded = Android.isTrackDownloaded(trackId);
      downloadStates[trackId] = {
        state: isDownloaded ? 'downloaded' : 'not_downloaded',
        progress: isDownloaded ? 100 : 0
      };
    }
  });
}

/**
 * Handle download button click
 */
function handleDownloadClick(event, index) {
  event.stopPropagation();

  if (!isAndroid) {
    console.warn('Download feature only available in Android app');
    return;
  }

  // Don't allow downloads when reader is 'random'
  if (currentReader === 'random') {
    console.warn('Cannot download tracks in random mode');
    if (Android.showToast) {
      Android.showToast('لا يمكن التنزيل في وضع القارئ العشوائي');
    }
    return;
  }

  const track = tracks[index];
  const trackId = getTrackId(currentReader, track.name);
  const state = downloadStates[trackId];

  if (state.state === 'downloaded') {
    // Show delete confirmation dialog
    showDeleteConfirmation(trackId, track.name);
  } else if (state.state === 'not_downloaded') {
    // Start download
    startDownload(trackId, track.url, track.name);
  } else if (state.state === 'downloading') {
    // Already downloading, ignore click
    console.log('Track is already downloading:', track.name);
  }
}

/**
 * Start downloading a track
 */
function startDownload(trackId, url, trackName) {
  console.log('Starting download:', trackName);

  // Update state to downloading
  downloadStates[trackId] = { state: 'downloading', progress: 0 };
  updateDownloadUI();

  // Call Android download method
  if (isAndroid && Android.downloadTrack) {
    Android.downloadTrack(trackId, url, trackName);
  }
}

/**
 * Show delete confirmation dialog
 */
function showDeleteConfirmation(trackId, trackName) {
  const message = `حذف ${trackName}؟\nهل أنت متأكد من حذف هذا المقطع؟`;

  if (confirm(message)) {
    deleteTrack(trackId);
  }
}

/**
 * Delete a downloaded track
 */
function deleteTrack(trackId) {
  console.log('Deleting track:', trackId);

  if (isAndroid && Android.deleteTrack) {
    Android.deleteTrack(trackId);
  }
}

/**
 * Update download UI for all tracks
 */
function updateDownloadUI() {
  const trackListDiv = document.getElementById('trackList');
  if (!trackListDiv) return;

  tracks.forEach((track, index) => {
    const trackId = getTrackId(currentReader, track.name);
    const state = downloadStates[trackId] || { state: 'not_downloaded', progress: 0 };

    const trackItem = trackListDiv.children[index];
    if (!trackItem) return;

    const downloadIcon = trackItem.querySelector('.download-arrow');
    if (!downloadIcon) return;

    // Update icon and text based on state
    if (state.state === 'downloaded') {
      // Show checkmark icon
      downloadIcon.src = 'icons/check-solid-full.svg';
      downloadIcon.alt = 'Downloaded';
      downloadIcon.style.filter = 'none'; // Remove white filter for green checkmark
      downloadIcon.setAttribute('data-state', 'downloaded');
    } else if (state.state === 'downloading') {
      // Show progress percentage
      downloadIcon.src = 'icons/arrow-down-solid-full.svg';
      downloadIcon.alt = `${state.progress}%`;
      downloadIcon.style.filter = 'brightness(0) invert(1)';
      downloadIcon.setAttribute('data-progress', state.progress);
      downloadIcon.setAttribute('data-state', 'downloading');

      // Add progress text overlay
      const progressText = trackItem.querySelector('.download-progress-text') || document.createElement('span');
      progressText.className = 'download-progress-text';
      progressText.textContent = `${state.progress}%`;
      progressText.style.cssText = 'position: absolute; right: 40px; font-size: 12px; color: #f39c12;';
      if (!trackItem.querySelector('.download-progress-text')) {
        trackItem.appendChild(progressText);
      }
    } else {
      // Show download arrow
      downloadIcon.src = 'icons/arrow-down-solid-full.svg';
      downloadIcon.alt = 'Download';
      downloadIcon.style.filter = 'brightness(0) invert(1)';
      downloadIcon.setAttribute('data-state', 'not_downloaded');

      // Remove progress text if exists
      const progressText = trackItem.querySelector('.download-progress-text');
      if (progressText) progressText.remove();
    }
  });
}

// ======= ANDROID CALLBACKS FOR DOWNLOAD =======

/**
 * Called by Android when download progress updates
 */
function onDownloadProgress(trackId, progress) {
  console.log(`Download progress for ${trackId}: ${progress}%`);

  if (downloadStates[trackId]) {
    downloadStates[trackId].progress = progress;
    updateDownloadUI();
  }
}

/**
 * Called by Android when download completes
 */
function onDownloadComplete(trackId, localPath) {
  console.log(`Download complete for ${trackId}: ${localPath}`);

  downloadStates[trackId] = { state: 'downloaded', progress: 100 };
  updateDownloadUI();

  if (isAndroid && Android.showToast) {
    Android.showToast('تم التنزيل بنجاح');
  }
}

/**
 * Called by Android when download fails
 */
function onDownloadError(trackId, error) {
  console.error(`Download error for ${trackId}:`, error);

  downloadStates[trackId] = { state: 'not_downloaded', progress: 0 };
  updateDownloadUI();

  if (isAndroid && Android.showToast) {
    Android.showToast('فشل التنزيل: ' + error);
  }
}

/**
 * Called by Android when track is deleted
 */
function onTrackDeleted(trackId, success) {
  console.log(`Track ${trackId} deleted:`, success);

  if (success) {
    downloadStates[trackId] = { state: 'not_downloaded', progress: 0 };
    updateDownloadUI();

    if (isAndroid && Android.showToast) {
      Android.showToast('تم الحذف بنجاح');
    }
  }
}

/**
 * Called by Android when storage permission is granted
 */
function onStoragePermissionGranted() {
  console.log('Storage permission granted!');
  // Initialize download states for current tracks
  initializeDownloadStates();
  updateDownloadUI();
}

/**
 * Update UI elements for offline mode
 */
function updateUIForOfflineMode() {
  const playButton = document.getElementById('playButton');
  const readerSelect = document.getElementById('readerSelect');

  if (!isOnlineMode) {
    // Hide stream play button in offline mode
    if (playButton) {
      playButton.style.display = 'none';
    }

    // Update reader select to show only readers with downloaded content
    updateReaderSelectForOffline();
  } else {
    // Show stream play button in online mode
    if (playButton) {
      playButton.style.display = 'block';
    }

    // Restore all readers in reader select
    if (readerSelect) {
      // Re-enable all options
      Array.from(readerSelect.options).forEach(option => {
        option.disabled = false;
      });
    }
  }
}

/**
 * Update reader select dropdown to show only readers with downloaded tracks
 */
function updateReaderSelectForOffline() {
  if (!isAndroid) return;

  const readerSelect = document.getElementById('readerSelect');
  if (!readerSelect) return;

  // In offline mode, enable all readers except 'random'
  // Users can switch between readers to see what's downloaded for each
  Array.from(readerSelect.options).forEach(option => {
    if (option.value === 'random') {
      // Always disable random in offline mode
      option.disabled = true;
    } else {
      // Enable all other readers
      option.disabled = false;
    }
  });
}

/**
 * Show message when no tracks are available in offline mode
 */
function showNoDownloadsMessage() {
  const trackListDiv = document.getElementById('trackList');
  if (trackListDiv) {
    trackListDiv.innerHTML = `
      <div class="trackItem offline-message">
        📥 لا توجد مقاطع محملة لهذا القارئ
        <br>
        <small>قم بالتبديل إلى الوضع المتصل لتنزيل المقاطع</small>
      </div>
    `;
  }
}

/**
 * Load only downloaded tracks for offline mode
 */
function loadOfflineTracks() {
  if (!isAndroid) {
    console.warn('Offline mode only available in Android app');
    return;
  }

  console.log('Loading offline tracks for reader:', currentReader);

  // At this point, tracks array is already loaded from the M3U file
  // We just need to filter it to show only downloaded tracks
  if (!tracks || tracks.length === 0) {
    showNoDownloadsMessage();
    return;
  }

  // Filter to show only downloaded tracks
  const downloadedTracks = tracks.filter((track) => {
    const trackId = getTrackId(currentReader, track.name);
    const state = downloadStates[trackId];
    return state && state.state === 'downloaded';
  });

  if (downloadedTracks.length === 0) {
    // No downloaded tracks for this reader - show empty message but keep reader accessible
    tracks = [];
    showNoDownloadsMessage();
    return;
  }

  // Replace tracks array with downloaded tracks only
  tracks = downloadedTracks;
  currentTrackIndex = 0;

  // Display the filtered track list
  displayTrackList();

  console.log(`Loaded ${downloadedTracks.length} downloaded tracks in offline mode for ${currentReader}`);
}

/**
 * Download all tracks in the current reader
 */
function downloadAllTracks() {
  if (!isAndroid) {
    console.warn('Download feature only available in Android app');
    return;
  }

  console.log('Downloading all tracks for reader:', currentReader);

  const downloadBtn = document.getElementById('downloadAllBtn');
  if (downloadBtn) {
    downloadBtn.disabled = true;
    downloadBtn.textContent = '⏳ جاري التنزيل...';
  }

  let downloadCount = 0;
  let totalToDownload = 0;

  // Count how many tracks need to be downloaded
  tracks.forEach((track) => {
    const trackId = getTrackId(currentReader, track.name);
    const state = downloadStates[trackId];
    if (state && state.state !== 'downloaded') {
      totalToDownload++;
    }
  });

  if (totalToDownload === 0) {
    if (isAndroid && Android.showToast) {
      Android.showToast('جميع المقاطع محملة بالفعل');
    }
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.textContent = '📥 تنزيل الكل';
    }
    return;
  }

  // Start downloading tracks that aren't downloaded
  tracks.forEach((track, index) => {
    const trackId = getTrackId(currentReader, track.name);
    const state = downloadStates[trackId];

    if (state && state.state === 'not_downloaded') {
      // Add a small delay between downloads to avoid overwhelming the system
      setTimeout(() => {
        startDownload(trackId, track.url, track.name);
      }, index * 500); // 500ms delay between each download start
    }
  });

  // Re-enable button after a delay
  setTimeout(() => {
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.textContent = '📥 تنزيل الكل';
    }
  }, 3000);
}

/**
 * Initialize menu system
 */
function initializeMenu() {
  console.log('Initializing menu system...');
  const burgerMenuBtn = document.getElementById('burgerMenuBtn');
  const onlineOfflineBtn = document.getElementById('onlineOfflineBtn');
  const downloadModeBtn = document.getElementById('downloadModeBtn');

  console.log('Burger button found:', burgerMenuBtn);
  console.log('Online/Offline button found:', onlineOfflineBtn);
  console.log('Download button found:', downloadModeBtn);

  if (!burgerMenuBtn || !onlineOfflineBtn || !downloadModeBtn) {
    console.error('Menu buttons not found in DOM!');
    return;
  }

  // Burger menu toggle
  burgerMenuBtn.addEventListener('click', toggleBurgerMenu);

  // Online/Offline toggle
  onlineOfflineBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleOnlineMode();
  });

  // Download mode toggle
  downloadModeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDownloadMode();
  });

  // Initialize button states
  updateMenuButtonStates();
  console.log('Menu system initialized successfully!');
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  // Initialize menu system
  initializeMenu();

  // Initialize offline mode UI on page load
  updateUIForOfflineMode();

  const languageSelector = document.getElementById("languageSelect");
  if (languageSelector) {
    languageSelector.addEventListener("change", async function () {
      const selectedLanguage = this.value;
      localStorage.setItem('language', selectedLanguage);

      // Stop audio before reloading to prevent background playback
      console.log('Language changed, stopping audio before reload...');
      if (isAndroid && Android.stopAudio) {
        Android.stopAudio();
      } else {
        const audioPlayer = document.getElementById("audioPlayer");
        if (audioPlayer) {
          audioPlayer.pause();
          audioPlayer.src = "";
        }
      }

      // Refresh the page for a fresh start with the new language
      window.location.reload();
    });
  }

  // Add keyboard navigation support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const isRtl = document.documentElement.dir === 'rtl';
      const goToNext = (isRtl && e.key === 'ArrowLeft') || (!isRtl && e.key === 'ArrowRight');
      
      if (goToNext) {
        toggleCircle(2);
      } else {
        toggleCircle(1);
      }
    } else if (e.key === ' ' || e.key === 'Enter') {
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT') {
        e.preventDefault();
        calculateTrackToPlay();
      }
    }
  });
});

// Initialize the app when the page loads
window.onload = async () => {
  console.log('Page loaded, initializing player...');
  console.log('Device detection - Apple device:', isAppleDevice);
  console.log('Running on Android:', isAndroid);

  // Show/hide appropriate controls based on platform
  if (isAndroid) {
    // Hide HTML audio player
    const audioSection = document.querySelector('.audio-section');
    if (audioSection) {
      audioSection.style.display = 'none';
    }

    // Show Android media controls
    const androidControls = document.getElementById('androidControls');
    if (androidControls) {
      androidControls.style.display = 'block';
    }
  }

  // Set language from localStorage
  const languageSelect = document.getElementById('languageSelect');
  const savedLanguage = localStorage.getItem('language') || 'ar';
  languageSelect.value = savedLanguage;
  isTranslated = savedLanguage !== 'ar';

  // Set document direction IMMEDIATELY based on saved language
  document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = savedLanguage;

  // Apply body direction class for immediate styling
  document.body.classList.remove('rtl', 'ltr');
  document.body.classList.add(savedLanguage === 'ar' ? 'rtl' : 'ltr');

  // Load translations if needed
  if (savedLanguage !== 'ar') {
    await loadTranslations(savedLanguage);
    translateUI(savedLanguage);
  } else {
    translateUI('ar');
  }

  // Load tracks for the selected reader
  await loadSelectedReader();
};
// ======= ANDROID MEDIA CONTROLS =======

/**
 * Toggle play/pause
 */
function togglePlayPause() {
  if (!isAndroid || !Android) return;

  if (isPlaying && !isPaused) {
    // Currently playing, pause it
    Android.pauseAudio();
    isPaused = true;
    updatePlayPauseButton(true);
  } else if (isPlaying && isPaused) {
    // Currently paused, resume it
    Android.resumeAudio();
    isPaused = false;
    updatePlayPauseButton(false);
  } else {
    // Not playing, start playback
    calculateTrackToPlay();
  }
}

/**
 * Stop playback
 */
function stopPlayback() {
  if (!isAndroid || !Android) return;

  Android.stopAudio();
  isPlaying = false;
  isPaused = false;
  updatePlayPauseButton(true); // true = show play icon (not playing)

  // Hide progress info
  const progressInfo = document.getElementById('progressInfo');
  if (progressInfo) {
    progressInfo.style.display = 'none';
  }

  const currentTrackDiv = document.getElementById('currentTrack');
  const readyText = isTranslated ?
    (translations['لاتوجد وسائط قيد التشغيل'] || 'No media playing') :
    '📻 لاتوجد وسائط قيد التشغيل';
  currentTrackDiv.textContent = readyText;
}

/**
 * Play next track (exits stream mode, enters playlist mode)
 */
function nextTrack() {
  console.log('>>> nextTrack() called');

  if (!isTracksReady || tracks.length === 0) {
    console.error('Cannot play next: tracks not ready or empty');
    console.log('isTracksReady:', isTracksReady);
    console.log('tracks.length:', tracks.length);
    return;
  }

  // Exit stream mode, enter playlist mode
  isStreamMode = false;
  console.log('Switched to PLAYLIST MODE');

  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  console.log('Next track index:', currentTrackIndex);
  console.log('Next track name:', tracks[currentTrackIndex]?.name);

  console.log('Calling playTrack(' + currentTrackIndex + ', 0, false)');
  playTrack(currentTrackIndex, 0, false); // Start from beginning
}

/**
 * Play previous track (exits stream mode, enters playlist mode)
 */
function previousTrack() {
  if (!isTracksReady || tracks.length === 0) return;

  // Exit stream mode, enter playlist mode
  isStreamMode = false;
  console.log('Switched to PLAYLIST MODE');

  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  playTrack(currentTrackIndex, 0, false); // Start from beginning
}

/**
 * Update play/pause button UI
 */
function updatePlayPauseButton(paused) {
  const button = document.getElementById('playPauseButton');
  if (button) {
    const playIcon = button.querySelector('.play-icon');
    const pauseIcon = button.querySelector('.pause-icon');

    if (playIcon && pauseIcon) {
      // SVG icons
      if (paused) {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      } else {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      }
    } else {
      // Fallback for FontAwesome icons
      const icon = button.querySelector('i');
      if (icon) {
        icon.className = paused ? 'fas fa-play' : 'fas fa-pause';
      } else {
        // Fallback for emoji version
        button.textContent = paused ? '▶️' : '⏸️';
      }
    }
  }
}

/**
 * Update UI from native player state (called from Android)
 */
function updatePlaybackState(playing, paused) {
  isPlaying = playing;
  isPaused = paused;
  updatePlayPauseButton(paused);
}

/**
 * Track completed callback (called from Android)
 */
function onTrackCompleted() {
  console.log('========================================');
  console.log('onTrackCompleted() called!');
  console.log('Current index before:', currentTrackIndex);
  console.log('Total tracks:', tracks.length);
  console.log('isTracksReady:', isTracksReady);
  console.log('isStreamMode:', isStreamMode);
  console.log('isPlaying:', isPlaying);
  console.log('isPaused:', isPaused);
  console.log('========================================');

  if (!isTracksReady || tracks.length === 0) {
    console.error('ERROR: Cannot auto-play next track - tracks not ready!');
    console.log('isTracksReady:', isTracksReady);
    console.log('tracks.length:', tracks.length);
    return;
  }

  console.log('Calling nextTrack()...');
  nextTrack();
}

/**
 * Update progress display (called from Android)
 */
// Format time as HH:MM:SS
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Track seeking state
let isSeeking = false;
let trackDuration = 0;

function updateProgress(currentTime, duration) {
  const progressInfo = document.getElementById('progressInfo');
  const currentTimeEl = document.getElementById('currentTime');
  const totalDurationEl = document.getElementById('totalDuration');
  const seekBar = document.getElementById('seekBar');

  if (!progressInfo || !currentTimeEl || !totalDurationEl) return;

  // Show progress info
  progressInfo.style.display = 'flex';

  // Store duration globally
  trackDuration = duration;

  // Only update if not seeking
  if (!isSeeking) {
    currentTimeEl.textContent = formatTime(currentTime);
    totalDurationEl.textContent = formatTime(duration);

    // Update seekbar
    if (seekBar && duration > 0) {
      const percentage = (currentTime / duration) * 100;
      seekBar.value = percentage;
      // Update seekbar background to show progress
      seekBar.style.background = `linear-gradient(to right, var(--color-primary) ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%)`;
    }
  }
}

/**
 * Initialize seekbar event listeners
 */
function initializeSeekbar() {
  const seekBar = document.getElementById('seekBar');
  const currentTimeEl = document.getElementById('currentTime');

  if (!seekBar) return;

  // Handle seeking start (mouse/touch down)
  seekBar.addEventListener('mousedown', () => {
    isSeeking = true;
  });

  seekBar.addEventListener('touchstart', () => {
    isSeeking = true;
  });

  // Handle seeking (dragging) - update time display
  seekBar.addEventListener('input', (e) => {
    if (isSeeking && trackDuration > 0) {
      const percentage = e.target.value;
      const newTime = (percentage / 100) * trackDuration;
      currentTimeEl.textContent = formatTime(newTime);

      // Update visual progress
      seekBar.style.background = `linear-gradient(to right, var(--color-primary) ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%)`;
    }
  });

  // Handle seeking end (mouse/touch up) - actually seek
  seekBar.addEventListener('mouseup', (e) => {
    if (isSeeking && trackDuration > 0) {
      const percentage = e.target.value;
      const newTime = (percentage / 100) * trackDuration;

      // Seek in Android
      if (isAndroid && Android.seekTo) {
        Android.seekTo(Math.floor(newTime));
      }
    }
    isSeeking = false;
  });

  seekBar.addEventListener('touchend', (e) => {
    if (isSeeking && trackDuration > 0) {
      const percentage = seekBar.value;
      const newTime = (percentage / 100) * trackDuration;

      // Seek in Android
      if (isAndroid && Android.seekTo) {
        Android.seekTo(Math.floor(newTime));
      }
    }
    isSeeking = false;
  });

  // Handle click/tap on seekbar track
  seekBar.addEventListener('change', (e) => {
    if (!isSeeking && trackDuration > 0) {
      const percentage = e.target.value;
      const newTime = (percentage / 100) * trackDuration;

      // Seek in Android
      if (isAndroid && Android.seekTo) {
        Android.seekTo(Math.floor(newTime));
      }
    }
  });
}

// Initialize seekbar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSeekbar);
} else {
  initializeSeekbar();
}
