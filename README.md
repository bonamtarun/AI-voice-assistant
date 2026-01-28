# AI Voice Assistant (SAM)

A smart web-based voice assistant powered by Google's Gemini API. SAM (Smart Assistant Model) listens to your voice commands, processes them using advanced AI, and responds back with spoken audio. It also supports custom commands to open popular websites hands-free.

## Features

-   **🎙️ Voice Interaction**: Conversational interface with Speech-to-Text and Text-to-Speech capabilities.
-   **🧠 AI Powered**: Utilizes `google-generativeai` (Gemini Flash) for intelligent and context-aware responses.
-   **⚡ Custom Commands**: specific voice triggers to open websites instantly:
    -   "Open Google"
    -   "Open YouTube"
    -   "Open ChatGPT"
    -   "Open Gmail"
    -   And more (LinkedIn, CodeChef, Perplexity).
-   **🌐 Web Interface**: Clean and simple UI for interacting with the assistant.

## Tech Stack

-   **Backend**: Python, Flask
-   **AI Model**: Google Gemini API
-   **Frontend**: HTML, CSS, JavaScript (Web Speech API)

## Prerequisites

-   Python 3.8 or higher installed.
-   A Google Gemini API Key.

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd AI-voice-assistant-main
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **API Key Setup**:
    -   Open `app.py`.
    -   Replace the `GENAI_API_KEY` variable with your actual Google Gemini API key.
    > **Note**: For production security, it is recommended to use environment variables instead of hardcoding keys.

## Usage

1.  **Start the backend server**:
    ```bash
    python app.py
    ```

2.  **Access the application**:
    -   Open your web browser and navigate to `http://localhost:5000` (or the URL provided in the terminal).

3.  **Interact**:
    -   Click the **"Start Listening"** button.
    -   Speak your query or command (e.g., "Tell me a joke" or "Open YouTube").
    -   SAM will respond thoroughly and speak out the answer.

## Troubleshooting

-   **Microphone functionality**: Ensure your browser has permission to access the microphone.
-   **Speech API**: This project uses the Web Speech API, which works best in Google Chrome.
-   **API Limitations**: This project uses a free API key. It may occasionally fail to answer questions or show an error due to usage limits.