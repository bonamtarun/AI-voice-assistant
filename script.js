const conversationDiv = document.getElementById('conversation');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');

let recognition;
let isListening = false;
let conversationEnded = false;

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
    // Ignore "no-speech" errors that may occur when stopping/starting recognition
    if (event.error !== 'no-speech') {
      addToConversation('Error: Speech recognition failed.');
      console.error('Speech recognition error:', event.error);
    }
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
    // Temporarily stop listening while processing command
    pauseListening();

    // Check if the conversation has been ended
    if (conversationEnded) {
      console.log("Conversation already ended, ignoring command");
      return;
    }

    // CHANGE THIS TO YOUR DEPLOYED BACKEND URL (e.g., 'https://your-app.onrender.com')
    // For local development, keep it as 'http://localhost:5000'
    const BACKEND_URL = 'http://localhost:5000';

    const response = await fetch(`${BACKEND_URL}/process-command`, {
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

    // Handle actions (like opening URLs)
    if (data.action === 'open_url' && data.url) {
      window.open(data.url, '_blank');
    }

    addToConversation(`SAM: ${data.response}`);
    speak(data.response);
  } catch (error) {
    console.error("Error:", error);
    addToConversation('SAM: Sorry, I encountered an error.');
    if (!conversationEnded) resumeListening(); // Resume listening in case of error, but only if conversation is still active
  }
}

// Text-to-speech with event handling
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);

  // When speech starts - already paused at this point
  utterance.onstart = () => {
    console.log("Speech started");
  };

  // When speech ends, resume listening only if conversation is still active
  utterance.onend = () => {
    console.log("Speech ended");
    if (!conversationEnded) {
      resumeListening();
    }
  };

  // In case of speech error, resume listening only if conversation is still active
  utterance.onerror = () => {
    console.error("Speech synthesis error");
    if (!conversationEnded) {
      resumeListening();
    }
  };

  speechSynthesis.speak(utterance);
}

// Pause listening function
function pauseListening() {
  if (isListening) {
    recognition.stop();
    isListening = false;
    console.log("Listening paused");
  }
}

// Resume listening function
function resumeListening() {
  if (!isListening && !document.hidden && !conversationEnded) { // Only resume if page is visible and conversation is active
    recognition.start();
    isListening = true;
    console.log("Listening resumed");
  }
}

// Function to introduce SAM and automatically start listening
function introduceAndListen() {
  conversationDiv.classList.add('visible');
  addToConversation('SAM: Hi, I am SAM. How can I help you?');
  speak('Hi, I am SAM. How can I help you?');
  // Note: listening will automatically start after speech ends due to the utterance.onend callback
}

// Start listening
startButton.addEventListener('click', () => {
  if (!isListening && !conversationEnded) {
    // Reset the conversation state if previously ended
    conversationEnded = false;
    introduceAndListen();
  } else if (conversationEnded) {
    // Allow restarting after ending
    conversationEnded = false;
    introduceAndListen();
  }
});

// Stop listening and end conversation
endButton.addEventListener('click', () => {
  // First stop listening and mark the conversation as ended
  endConversation();

  addToConversation('SAM: Conversation ended manually. Goodbye!');

  // Create a special utterance for goodbye that doesn't auto-resume listening
  const utterance = new SpeechSynthesisUtterance('Conversation ended manually. Goodbye!');

  // No need for special onend handler as resumeListening checks conversationEnded flag

  speechSynthesis.speak(utterance);

  // conversationDiv.classList.remove('visible'); // Uncomment if you want to hide the box when ending
});

function stopListening() {
  if (isListening) {
    recognition.stop();
    isListening = false;
  }
}

function endConversation() {
  stopListening();
  conversationEnded = true;
  console.log("Conversation marked as ended");
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseListening();
  } else if (!speechSynthesis.speaking && !conversationEnded) {
    // Only resume if not currently speaking and conversation is still active
    resumeListening();
  }
});
