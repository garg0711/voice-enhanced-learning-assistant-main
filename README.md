# Voice-Enhanced-Learning-Assistant

Voice Enhanced Learning Assistant is a web-based interactive learning platform that leverages voice commands to generate personalized educational content. The application uses a local Large Language Model (LLM) through the Ollama API to generate text responses from user speech, and then converts that text into audible speech using Google Text-to-Speech (gTTS). The project is built with Flask for the backend and uses HTML, CSS, and JavaScript for the front end.

# Features

**Voice Command Interface:**
Users can interact with the application using their voice via the Web Speech API.

**LLM Integration:**
The app sends the transcribed voice input to an LLM (via Ollama API) to generate a text response.

**Text-to-Speech (TTS):**
The generated text is converted to speech using gTTS, allowing the response to be played back to the user.

**Content Sanitization:**
HTML tags and emojis are removed from the generated text to ensure clean output.

**Simple and Responsive UI:**
A straightforward user interface built with HTML and CSS enables users to easily start and stop voice interaction.

# Technology Stack

**Front-End:**
HTML, CSS, JavaScript (using the Web Speech API for voice recognition)

**Back-End:**
Python with Flask

**LLM API Integration:**
Ollama API (running locally)

**Text-to-Speech:**
Google Text-to-Speech (gTTS)

**Other Libraries:**
requests, re, emoji

# Project Structure

![image](https://github.com/user-attachments/assets/16934466-1e9b-48d6-9afb-e682108aed6c)


# Setup and Installation

**->Clone the Repository:**

git clone https://github.com/Marcus8134/voice-enhanced-learning-assistant.git

cd voice-enhanced-learning-assistant

**->Create a Virtual Environment:**
python -m venv venv

Activate on macOS/Linux: -> 
source venv/bin/activate

Activate on Windows: -> 
venv\Scripts\activate

**->Install Dependencies:**

pip install Flask requests gtts emoji

**->Set Up Ollama:**

Download and install Ollama from ollama.com.

**->Pull an LLM model:**
ollama pull llama3.1:latest

**->Start the Ollama server:**
ollama serve

This will run the API server on http://localhost:11434.

**->Run the Flask Application:**
python app.py

**->Open the Application:**

Open your web browser and navigate to http://127.0.0.1:5000.



# How It Works

**=> User Interface:**

When the user visits the homepage, index.html is rendered, displaying a welcome message and buttons to start or stop voice recording.


**=> Voice Input:**

When the user clicks “Start Listening,” the browser’s Web Speech API captures and transcribes the user's voice into text.


**=> Backend Processing:**

The transcribed text is sent to the Flask endpoint /process.

The endpoint calls the generate_response function, which sends the text as a prompt to the Ollama API. The LLM processes this prompt and returns a text response.

The response is cleaned (HTML tags and emojis removed) and then passed to the text_to_speech function, which uses gTTS to generate an MP3 file saved in the static directory.

A JSON object containing both the cleaned text and the URL of the audio file is returned.


**=> Output Delivery:**

The front end receives the JSON response, displays the text, and plays the audio using an HTML5 audio element.


# Workflow Summary
**User Interaction:**
The user clicks "Start Listening" to capture voice input via the Web Speech API.

**Voice Input Processing:**
The captured voice is transcribed to text and sent to the Flask backend via a POST request.

**LLM Response Generation:**
The Flask backend calls the Ollama API with the user’s text prompt. The LLM processes the prompt and returns a text response.

**Text-to-Speech Conversion:**
The generated text is cleaned and converted to speech using gTTS. The audio file is saved in the static directory.

**Output Delivery:**
A JSON response containing the text and the audio file URL is sent back to the front end, which displays the text and plays the speech audio.

# Contributing

**Contributions are welcome!**

Fork the repository.

Create a new branch for your feature or bug fix.

Commit your changes and push the branch.

Open a pull request describing your changes.

# License

This project is licensed under the MIT License.

