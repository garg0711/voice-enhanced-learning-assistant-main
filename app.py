import os
import requests
from gtts import gTTS
import time
import re
import emoji
from flask import Flask, render_template, request, jsonify
from gtts.lang import tts_langs

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/process", methods=["POST"])
def process():
    data = request.get_json()
    user_text = data.get("text", "")
    lang_code = data.get("lang", "en")  # Default to English if not provided
    
    # Use the generate_response function to call the Ollama API
    response_text = generate_response(user_text)
    
    response_text = remove_html_tags(response_text)
    response_text = remove_emojis(response_text)
    # Convert the generated text to speech with selected language
    audio_filename = text_to_speech(response_text, lang_code)
    audio_url = os.path.join("/static", audio_filename)
    
    return jsonify({"text": response_text, "audio_url": audio_url})

def generate_response(input_text):
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "deepseek-r1:1.5b",  # Change model name as needed
        "prompt": input_text,
        "stream": False  # For a single complete response
    }
    
    try:
        r = requests.post(url, json=payload)
        r.raise_for_status()
        json_data = r.json()
        return json_data.get("response", "No response generated.")
    except requests.RequestException as e:
        print(f"Error communicating with Ollama API: {e}")
        # Print detailed error information for debugging
        if hasattr(e, 'response'):
            print(f"Response status code: {e.response.status_code}")
            print(f"Response text: {e.response.text}")
            return f"Error generating response. Status: {e.response.status_code}. Please make sure Ollama is running with 'ollama serve' and you've pulled the model with 'ollama pull deepseek-r1:1.5b'."
        return "Error connecting to Ollama API. Please make sure Ollama is running with 'ollama serve'."

def remove_html_tags(text):
    return re.sub(r'<[^>]+>', '', text)

def remove_emojis(text):
    return emoji.replace_emoji(text, replace=' ')

def text_to_speech(text, lang_code='en'):
    # Validate the language code against supported languages
    supported_langs = tts_langs()
    if lang_code not in supported_langs:
        print(f"Language {lang_code} not supported. Falling back to English.")
        lang_code = 'en'  # fallback to English
    
    tts = gTTS(text=text, lang=lang_code)
    # Generate a unique filename using timestamp
    timestamp = int(time.time())
    audio_filename = f"response_{timestamp}.mp3"
    audio_path = os.path.join("static", audio_filename)
    tts.save(audio_path)
    return audio_filename

if __name__ == "__main__":
    app.run(debug=True)
