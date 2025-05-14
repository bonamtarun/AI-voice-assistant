from flask import Flask, request, jsonify
from flask_cors import CORS  # Enable CORS
import google.generativeai as genai
import webbrowser

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
GENAI_API_KEY = "AIzaSyCxtquBVOCafgnz7-9BSkNTdlvfi0rjDT8"
genai.configure(api_key=GENAI_API_KEY)

# Custom commands
COMMANDS = {
    "open google": "https://google.com",
    "open youtube": "https://youtube.com",
    "open chatgpt": "https://chatgpt.com",
    "open codechef": "https://codechef.com",
    "open linkedin": "https://linkedin.com",
    "open perplexity": "https://www.perplexity.ai",
    "open gmail": "https://gmail.com",
}

def generate_response(query):
    """Generate a response for the given query using Gemini."""
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(query, generation_config=genai.GenerationConfig(
            max_output_tokens=75,
            temperature=0.1,
        ))
        return response.text
    except Exception as e:
        return f"Sorry, I encountered an error: {e}"

def process_command(command):
    """Process custom commands."""
    for keyword, url in COMMANDS.items():
        if keyword in command:
            webbrowser.open(url)
            return f"Opening {keyword.replace('open ', '')}."
    return None

@app.route('/process-command', methods=['POST'])
def process_command_endpoint():
    data = request.json
    print("Received data:", data)  # Debugging
    command = data['command']

    # Handle custom commands
    custom_response = process_command(command)
    if custom_response:
        return jsonify({'response': custom_response})

    # Generate a response using Gemini
    response = generate_response(command)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)