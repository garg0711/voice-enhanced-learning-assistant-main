let playbackRate = 1.0;
let recognition;
let recognizing = false;

// UI elements
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const pauseBtn = document.getElementById('pause-btn');
const resumeBtn = document.getElementById('resume-btn');
const speedSlider = document.getElementById('speed-slider');
const speedDisplay = document.getElementById('speed-display');
const outputDiv = document.getElementById('output');
const audioPlayer = document.getElementById('audio-player');
const languageSelect = document.getElementById('language-select');
const micBorder = document.getElementById('mic-border');
const textForm = document.getElementById('text-form');
const textInput = document.getElementById('text-input');
const historyDiv = document.getElementById('history');
const statusText = document.getElementById('status-text');

// Map gTTS language codes to BCP-47 codes for browser TTS/SpeechRecognition
const langMap = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  hi: 'hi-IN',
  ar: 'ar-SA'
};

// Microphone animation
function animateMic(listening) {
  if (micBorder) {
    micBorder.style.stroke = listening ? '#4caf50' : '#2b3a67';
    micBorder.setAttribute('r', listening ? '32' : '28');
  }
}

// Playback speed update
function updateSpeed(val) {
  playbackRate = parseFloat(val);
  speedDisplay.textContent = `${playbackRate.toFixed(1)}x`;
}

// Status message
function showStatus(msg) {
  statusText.textContent = msg;
}

// Add to history
function addToHistory(user, assistant) {
  historyDiv.innerHTML += `<div style="margin-bottom:8px;"><strong>You:</strong> ${user}<br><strong>Assistant:</strong> ${assistant}</div>`;
}

// Handle transcript (from voice or text)
function handleTranscript(transcript) {
  outputDiv.innerHTML += `<p class="user">You said: ${transcript}</p>`;
  showStatus("Processing...");
  fetch('/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: transcript, lang: languageSelect.value })
  })
    .then(response => response.json())
    .then(data => {
      outputDiv.innerHTML += `<p class="assistant">Assistant: ${data.text}</p>`;
      if (data.audio_url) {
        audioPlayer.src = data.audio_url;
        audioPlayer.playbackRate = playbackRate;
        audioPlayer.play();
      }
      // Speak with browser TTS
      const utterance = new SpeechSynthesisUtterance(data.text);
      utterance.lang = langMap[languageSelect.value] || 'en-US';
      utterance.rate = playbackRate;
      window.speechSynthesis.speak(utterance);
      addToHistory(transcript, data.text);
      showStatus("Response delivered.");
    })
    .catch(error => {
      showStatus(`Error: ${error}`);
    });
}

// Initialize SpeechRecognition
function initRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition. Please try Chrome or Edge.");
    return null;
  }
  const rec = new SpeechRecognition();
  rec.lang = langMap[languageSelect.value] || 'en-US';
  rec.interimResults = false;

  rec.onstart = () => { showStatus("Listening..."); animateMic(true); };
  rec.onend = () => { showStatus(""); animateMic(false); recognizing = false; };
  rec.onerror = (event) => {
    showStatus(`Speech recognition error: ${event.error}`);
    animateMic(false);
  };
  rec.onresult = function(event) {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
    handleTranscript(transcript);
  };
  return rec;
}

// Event bindings
startBtn.addEventListener('click', () => {
  if (!recognition) recognition = initRecognition();
  if (!recognition) return;
  recognition.lang = langMap[languageSelect.value] || 'en-US';
  recognition.start();
  recognizing = true;
});

stopBtn.addEventListener('click', () => {
  if (recognition && recognizing) {
    recognition.stop();
    recognizing = false;
    showStatus("Stopped listening.");
    animateMic(false);
  }
});

pauseBtn.addEventListener('click', () => {
  window.speechSynthesis.pause();
  showStatus("Speech paused.");
});

resumeBtn.addEventListener('click', () => {
  window.speechSynthesis.resume();
  showStatus("Speech resumed.");
});

speedSlider.addEventListener('input', (e) => {
  updateSpeed(e.target.value);
});

languageSelect.addEventListener('change', () => {
  if (recognition) recognition.lang = langMap[languageSelect.value] || 'en-US';
});

// Text form submit
textForm.onsubmit = function(e) {
  e.preventDefault();
  const input = textInput.value;
  if (input.trim()) {
    handleTranscript(input);
    textInput.value = '';
  }
};
