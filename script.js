const conversationDiv = document.getElementById('conversation');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');

let recognition;
let isListening = false;

// Initialize speech recognition
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-IN';

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
    addToConversation(`You: ${transcript}`);
    handleCommand(transcript);
  };

  recognition.onerror = (event) => {
    addToConversation('Error: Speech recognition failed.');
    console.error('Speech recognition error:', event.error);
  };
} else {
  alert('Your browser does not support speech recognition.');
}

// Add text to the conversation area
function addToConversation(text) {
  const p = document.createElement('p');
  p.textContent = text;
  conversationDiv.appendChild(p);
  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

// Handle user commands
async function handleCommand(command) {
  try {
    const response = await fetch('http://localhost:5000/process-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    addToConversation(`SAM: ${data.response}`);
    speak(data.response);
  } catch (error) {
    console.error("Error:", error);
    addToConversation('SAM: Sorry, I encountered an error.');
  }
}

// Text-to-speech
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// Start listening
startButton.addEventListener('click', () => {
  if (!isListening) {
    conversationDiv.classList.add('visible');
    recognition.start();
    isListening = true;
    addToConversation('SAM: Hi, I am SAM. How can I help you?');
    speak('Hi, I am SAM. How can I help you?');
  }
});

// Stop listening
endButton.addEventListener('click', () => {
  stopListening();
  addToConversation('SAM: Conversation ended manually. Goodbye!');
  speak('Conversation ended manually. Goodbye!');
  // conversationDiv.classList.remove('visible'); // Uncomment if you want to hide the box when ending
});

function stopListening() {
  if (isListening) {
    recognition.stop();
    isListening = false;
  }
}